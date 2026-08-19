import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { appointmentReminder } from "@/lib/inngest/functions/appointment-reminder";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [appointmentReminder],
});
