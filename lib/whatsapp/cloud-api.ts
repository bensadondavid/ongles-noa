import {
  getWhatsAppConfig,
  getWhatsAppDateLocale,
  type WhatsAppTemplateLanguage,
} from "@/lib/whatsapp/config";
import { normalizePhoneNumber } from "@/lib/phone";

const TIME_ZONE = "Asia/Jerusalem";

export function normalizeWhatsAppPhoneNumber(phone: string) {
  const trimmedPhone = phone.trim().replace(/^whatsapp:/i, "");

  // Meta fournit les numéros entrants en E.164 sans le signe `+`.
  // Ils sont déjà complets et ne doivent pas recevoir un second indicatif.
  if (/^[1-9]\d{6,14}$/.test(trimmedPhone)) {
    return trimmedPhone;
  }

  return normalizePhoneNumber(phone, "IL").slice(1);
}

type AppointmentReminderInput = {
  phone: string;
  startsAt: Date;
  locale: WhatsAppTemplateLanguage;
};

type WhatsAppApiResponse = {
  messages?: Array<{ id?: string }>;
  error?: {
    code?: number;
    message?: string;
    type?: string;
  };
};

type WhatsAppTextInput = {
  phone: string;
  text: string;
  replyToMessageId?: string;
};

async function readWhatsAppResponse(response: Response) {
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

  return messageId;
}

export async function sendWhatsAppText({
  phone,
  text,
  replyToMessageId,
}: WhatsAppTextInput) {
  const config = getWhatsAppConfig();
  const normalizedText = text.trim();

  if (!normalizedText || normalizedText.length > 4_096) {
    throw new Error("Le message doit contenir entre 1 et 4 096 caractères");
  }

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
        ...(replyToMessageId
          ? { context: { message_id: replyToMessageId } }
          : {}),
        type: "text",
        text: {
          body: normalizedText,
          preview_url: false,
        },
      }),
      signal: AbortSignal.timeout(15_000),
    },
  );

  return {
    id: await readWhatsAppResponse(response),
    status: "accepted" as const,
  };
}

export async function sendAppointmentReminder({
  phone,
  startsAt,
  locale,
}: AppointmentReminderInput) {
  const config = getWhatsAppConfig();
  const dateLocale = getWhatsAppDateLocale(locale);

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
            code: locale,
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

  return {
    id: await readWhatsAppResponse(response),
    status: "accepted" as const,
  };
}
