import { prisma } from "@/lib/data/prisma";
import { inngest } from "@/lib/inngest/client";
import {
  appointmentCreatedEvent,
  appointmentReminderRequestedEvent,
} from "@/lib/inngest/events";
import { areWhatsAppRemindersEnabled } from "@/lib/inngest/reminders";
import { sendAppointmentReminder } from "@/lib/whatsapp/cloud-api";
import {
  getAppointmentReminderAt,
  getTomorrowBounds,
} from "@/lib/whatsapp/reminder-schedule";

function createReminderRequestedEvent(appointmentId: string) {
  return appointmentReminderRequestedEvent.create(
    { appointmentId },
    { id: `appointment-reminder-${appointmentId}` },
  );
}

export const dailyAppointmentReminderScheduler = inngest.createFunction(
  {
    id: "schedule-daily-appointment-whatsapp-reminders",
    triggers: { cron: "TZ=Asia/Jerusalem 0 20 * * *" },
  },
  async ({ step }) => {
    if (!areWhatsAppRemindersEnabled()) {
      return { skipped: true, reason: "whatsapp-reminders-disabled" };
    }

    const appointmentIds = await step.run(
      "load-tomorrows-appointments",
      async () => {
        const { start, end } = getTomorrowBounds(new Date());
        const appointments = await prisma.appointment.findMany({
          where: {
            startsAt: { gte: start, lt: end },
            status: "CONFIRMED",
            reminderSentAt: null,
          },
          select: { id: true },
        });

        return appointments.map(({ id }) => id);
      },
    );

    if (appointmentIds.length === 0) {
      return { queued: 0 };
    }

    await step.sendEvent(
      "enqueue-tomorrows-appointment-reminders",
      appointmentIds.map(createReminderRequestedEvent),
    );

    return { queued: appointmentIds.length };
  },
);

export const lateAppointmentReminderScheduler = inngest.createFunction(
  {
    id: "schedule-late-appointment-whatsapp-reminder",
    triggers: appointmentCreatedEvent,
  },
  async ({ event, step }) => {
    if (!areWhatsAppRemindersEnabled()) {
      return { skipped: true, reason: "whatsapp-reminders-disabled" };
    }

    const appointment = await step.run("load-late-appointment", () =>
      prisma.appointment.findUnique({
        where: { id: event.data.appointmentId },
        select: {
          id: true,
          startsAt: true,
          status: true,
          reminderSentAt: true,
        },
      }),
    );

    if (
      !appointment ||
      appointment.status !== "CONFIRMED" ||
      appointment.reminderSentAt
    ) {
      return { skipped: true, reason: "appointment-not-eligible" };
    }

    const eventTime = new Date(event.ts);
    const startsAt = new Date(appointment.startsAt);

    if (getAppointmentReminderAt(startsAt) > eventTime) {
      return { skipped: true, reason: "daily-cron-will-handle-reminder" };
    }

    if (startsAt <= eventTime) {
      return { skipped: true, reason: "appointment-already-started" };
    }

    await step.sendEvent(
      "enqueue-late-appointment-reminder",
      createReminderRequestedEvent(appointment.id),
    );

    return { queued: 1 };
  },
);

export const appointmentReminderSender = inngest.createFunction(
  {
    id: "send-appointment-whatsapp-reminder",
    idempotency: "event.data.appointmentId",
    concurrency: 5,
    triggers: appointmentReminderRequestedEvent,
  },
  async ({ event, step }) => {
    if (!areWhatsAppRemindersEnabled()) {
      return { skipped: true, reason: "whatsapp-reminders-disabled" };
    }

    const result = await step.run("send-whatsapp-reminder", async () => {
      const appointment = await prisma.appointment.findUnique({
        where: { id: event.data.appointmentId },
        select: {
          startsAt: true,
          status: true,
          customerPhone: true,
          locale: true,
          reminderSentAt: true,
        },
      });

      if (
        !appointment ||
        appointment.status !== "CONFIRMED" ||
        appointment.reminderSentAt
      ) {
        return { skipped: true, reason: "appointment-not-eligible" } as const;
      }

      if (appointment.startsAt <= new Date()) {
        return { skipped: true, reason: "appointment-already-started" } as const;
      }

      const message = await sendAppointmentReminder({
        phone: appointment.customerPhone,
        startsAt: appointment.startsAt,
        locale: appointment.locale,
      });

      return { skipped: false, message } as const;
    });

    if (result.skipped) {
      return result;
    }

    await step.run("mark-reminder-as-sent", () =>
      prisma.appointment.updateMany({
        where: {
          id: event.data.appointmentId,
          reminderSentAt: null,
        },
        data: { reminderSentAt: new Date() },
      }),
    );

    return result.message;
  },
);
