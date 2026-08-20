import { eventType } from "inngest";
import { z } from "zod";

const appointmentEventSchema = z.object({
  appointmentId: z.string().min(1),
});

export const appointmentCreatedEvent = eventType("appointment/created", {
  schema: appointmentEventSchema,
});

export const appointmentCancelledEvent = eventType("appointment/cancelled", {
  schema: appointmentEventSchema,
});
