const TIME_ZONE = "Asia/Jerusalem";

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value;
}

function normalizePhoneNumber(phone: string) {
  let normalized = phone.trim().replace(/^whatsapp:/i, "");
  normalized = normalized.replace(/[\s().-]/g, "");

  if (normalized.startsWith("00")) {
    normalized = normalized.slice(2);
  } else if (normalized.startsWith("+")) {
    normalized = normalized.slice(1);
  } else if (normalized.startsWith("0")) {
    normalized = `972${normalized.slice(1)}`;
  }

  if (!/^[1-9]\d{6,14}$/.test(normalized)) {
    throw new Error("Le numéro WhatsApp doit être au format international E.164");
  }

  return normalized;
}

type AppointmentReminderInput = {
  phone: string;
  startsAt: Date;
};

type WhatsAppApiResponse = {
  messages?: Array<{ id?: string }>;
  error?: {
    code?: number;
    message?: string;
    type?: string;
  };
};

export async function sendAppointmentReminder({
  phone,
  startsAt,
}: AppointmentReminderInput) {
  const apiVersion = getRequiredEnv("WHATSAPP_GRAPH_API_VERSION");
  if (!/^v\d+\.\d+$/.test(apiVersion)) {
    throw new Error("WHATSAPP_GRAPH_API_VERSION doit être au format vXX.X");
  }

  const date = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeZone: TIME_ZONE,
  }).format(startsAt);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(startsAt);

  const phoneNumberId = getRequiredEnv("WHATSAPP_PHONE_NUMBER_ID");
  const response = await fetch(
    `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getRequiredEnv("WHATSAPP_ACCESS_TOKEN")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: normalizePhoneNumber(phone),
        type: "template",
        template: {
          name: getRequiredEnv("WHATSAPP_APPOINTMENT_REMINDER_TEMPLATE"),
          language: {
            code: getRequiredEnv("WHATSAPP_TEMPLATE_LANGUAGE"),
          },
          components: [
            {
              type: "body",
              parameters: [
                { type: "text", text: date },
                { type: "text", text: time },
              ],
            },
          ],
        },
      }),
      signal: AbortSignal.timeout(15_000),
    },
  );

  const result = (await response.json()) as WhatsAppApiResponse;

  if (!response.ok) {
    const details = result.error;
    throw new Error(
      `Échec WhatsApp Cloud API (${response.status}${
        details?.code ? `/${details.code}` : ""
      }) : ${details?.message ?? details?.type ?? "erreur inconnue"}`,
    );
  }

  const messageId = result.messages?.[0]?.id;
  if (!messageId) {
    throw new Error("WhatsApp Cloud API n'a retourné aucun identifiant de message");
  }

  return { id: messageId, status: "accepted" as const };
}
