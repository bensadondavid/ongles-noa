import { inngest } from "@/lib/inngest/client";
import { appointmentCreatedEvent } from "@/lib/inngest/events";
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
