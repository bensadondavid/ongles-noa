import { inngest } from "@/lib/inngest/client";
import {
  appointmentCancelledEvent,
  appointmentCreatedEvent,
} from "@/lib/inngest/events";
import { areWhatsAppRemindersEnabled } from "@/lib/whatsapp/config";

export { areWhatsAppRemindersEnabled } from "@/lib/whatsapp/config";

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
