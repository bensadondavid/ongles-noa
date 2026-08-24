import { inngest } from "@/lib/inngest/client";
import {
  appointmentCancelledEvent,
  appointmentCreatedEvent,
} from "@/lib/inngest/events";

export function areWhatsAppRemindersEnabled() {
  return process.env.WHATSAPP_REMINDERS_ENABLED?.trim().toLowerCase() === "true";
}

export async function scheduleAppointmentReminder(appointmentId: string) {
  if (!areWhatsAppRemindersEnabled()) {
    return false;
  }

  await inngest.send(
    appointmentCreatedEvent.create(
      { appointmentId },
      { id: `appointment-created-${appointmentId}` },
    ),
  );

  return true;
}

export async function cancelAppointmentReminder(appointmentId: string) {
  if (!areWhatsAppRemindersEnabled()) {
    return false;
  }

  await inngest.send(
    appointmentCancelledEvent.create(
      { appointmentId },
      { id: `appointment-cancelled-${appointmentId}` },
    ),
  );

  return true;
}
