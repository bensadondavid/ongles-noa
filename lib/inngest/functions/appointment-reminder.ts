import { inngest } from "@/lib/inngest/client";
import { prisma } from "@/lib/data/prisma";
import { sendAppointmentReminder } from "@/lib/whatsapp/cloud-api";
import {
  appointmentCancelledEvent,
  appointmentCreatedEvent,
} from "@/lib/inngest/events";
import { areWhatsAppRemindersEnabled } from "@/lib/inngest/reminders";

const REMINDER_LEAD_TIME_MS = 24 * 60 * 60 * 1000;

export const appointmentReminder = inngest.createFunction(
  {
    id: "appointment-whatsapp-reminder",
    idempotency: "event.data.appointmentId",
    singleton: {
      key: "event.data.appointmentId",
      mode: "skip",
    },
    triggers: appointmentCreatedEvent,
    cancelOn: [
      {
        event: appointmentCancelledEvent,
        match: "data.appointmentId",
      },
    ],
  },
  async ({ event, step }) => {
    if (!areWhatsAppRemindersEnabled()) {
      return { skipped: true, reason: "whatsapp-reminders-disabled" };
    }

    const appointmentId = event.data.appointmentId;

    const schedule = await step.run("load-reminder-schedule", async () => {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: { startsAt: true, status: true },
      });

      if (!appointment || appointment.status === "CANCELLED") {
        return null;
      }

      return {
        reminderAt: new Date(
          appointment.startsAt.getTime() - REMINDER_LEAD_TIME_MS,
        ).toISOString(),
      };
    });

    if (!schedule) {
      return { skipped: true, reason: "appointment-missing-or-cancelled" };
    }

    if (new Date(schedule.reminderAt) > new Date()) {
      await step.sleepUntil("wait-until-reminder", schedule.reminderAt);
    }

    return step.run("send-whatsapp-reminder", async () => {
      if (!areWhatsAppRemindersEnabled()) {
        return { skipped: true, reason: "whatsapp-reminders-disabled" };
      }

      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: {
          startsAt: true,
          status: true,
          customerPhone: true,
        },
      });

      if (!appointment || appointment.status === "CANCELLED") {
        return { skipped: true, reason: "appointment-missing-or-cancelled" };
      }

      if (appointment.startsAt <= new Date()) {
        return { skipped: true, reason: "appointment-already-started" };
      }

      return sendAppointmentReminder({
        phone: appointment.customerPhone,
        startsAt: appointment.startsAt,
      });
    });
  },
);
