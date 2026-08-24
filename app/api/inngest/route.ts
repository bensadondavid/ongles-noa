import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { appointmentReminder } from "@/lib/inngest/functions/appointment-reminder";

export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [appointmentReminder],
});
