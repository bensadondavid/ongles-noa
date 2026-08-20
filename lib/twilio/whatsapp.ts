import twilio from "twilio";

const SANDBOX_APPOINTMENT_REMINDER_SID =
  "HXb5b62575e6e4ff6129ad7c8efe1f983e";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value;
}

function toWhatsAppAddress(phone: string) {
  let normalized = phone.trim().replace(/^whatsapp:/, "");
  normalized = normalized.replace(/[\s().-]/g, "");

  if (normalized.startsWith("00")) {
    normalized = `+${normalized.slice(2)}`;
  } else if (normalized.startsWith("0")) {
    normalized = `+972${normalized.slice(1)}`;
  }

  if (!/^\+[1-9]\d{6,14}$/.test(normalized)) {
    throw new Error("Le numéro WhatsApp doit être au format international E.164");
  }

  return `whatsapp:${normalized}`;
}

function getTwilioClient() {
  const accountSid = getRequiredEnv("TWILIO_ACCOUNT_SID");
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;

  if (Boolean(apiKeySid) !== Boolean(apiKeySecret)) {
    throw new Error(
      "TWILIO_API_KEY_SID et TWILIO_API_KEY_SECRET doivent être définis ensemble",
    );
  }

  if (apiKeySid && apiKeySecret) {
    return twilio(apiKeySid, apiKeySecret, { accountSid });
  }

  return twilio(accountSid, getRequiredEnv("TWILIO_AUTH_TOKEN"));
}

type AppointmentReminderInput = {
  phone: string;
  startsAt: Date;
};

export async function sendAppointmentReminder({
  phone,
  startsAt,
}: AppointmentReminderInput) {
  const timeZone = "Asia/Jerusalem";
  const date = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeZone,
  }).format(startsAt);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(startsAt);

  const message = await getTwilioClient().messages.create({
    from: toWhatsAppAddress(getRequiredEnv("TWILIO_WHATSAPP_FROM")),
    to: toWhatsAppAddress(phone),
    contentSid:
      process.env.TWILIO_APPOINTMENT_REMINDER_CONTENT_SID ??
      SANDBOX_APPOINTMENT_REMINDER_SID,
    contentVariables: JSON.stringify({ "1": date, "2": time }),
  });

  return { sid: message.sid, status: message.status };
}
