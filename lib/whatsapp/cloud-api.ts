import {
  getWhatsAppConfig,
  getWhatsAppDateLocale,
} from "@/lib/whatsapp/config";

const TIME_ZONE = "Asia/Jerusalem";

export function normalizeWhatsAppPhoneNumber(phone: string) {
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
  const config = getWhatsAppConfig();
  const dateLocale = getWhatsAppDateLocale(config.templateLanguage);

  const date = new Intl.DateTimeFormat(dateLocale, {
    dateStyle: "long",
    timeZone: TIME_ZONE,
  }).format(startsAt);
  const time = new Intl.DateTimeFormat(dateLocale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(startsAt);

  const response = await fetch(
    `https://graph.facebook.com/${config.apiVersion}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: normalizeWhatsAppPhoneNumber(phone),
        type: "template",
        template: {
          name: config.templateName,
          language: {
            code: config.templateLanguage,
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

  const responseText = await response.text();
  let result: WhatsAppApiResponse = {};

  if (responseText) {
    try {
      result = JSON.parse(responseText) as WhatsAppApiResponse;
    } catch {
      if (!response.ok) {
        throw new Error(
          `Échec WhatsApp Cloud API (${response.status}) : réponse illisible`,
        );
      }
    }
  }

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
