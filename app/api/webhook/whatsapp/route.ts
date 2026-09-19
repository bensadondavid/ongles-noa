import { createHmac, timingSafeEqual } from "node:crypto";

const WHATSAPP_MESSAGE_ID_PATTERN = /^wamid\.[A-Za-z0-9+/=_-]{1,512}$/;
const WHATSAPP_PHONE_PATTERN = /^[1-9]\d{6,14}$/;

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

type InboundMessage = {
  messageId: string;
  fromPhone: string;
  profileName?: string;
  type: string;
  text?: string;
  receivedAt: Date;
};

function getInboundMessageText(message: Record<string, unknown>) {
  const interactive = asRecord(message.interactive);
  const candidates = [
    asRecord(message.text).body,
    asRecord(message.button).text,
    asRecord(interactive.button_reply).title,
    asRecord(interactive.list_reply).title,
    asRecord(message.image).caption,
    asRecord(message.video).caption,
    asRecord(message.document).caption,
    asRecord(message.reaction).emoji,
  ];

  const text = candidates.find(
    (candidate): candidate is string =>
      typeof candidate === "string" && Boolean(candidate.trim()),
  );

  return text?.trim().slice(0, 4096);
}

export function extractInboundMessages(event: unknown): InboundMessage[] {
  const messages: InboundMessage[] = [];

  for (const entry of asArray(asRecord(event).entry)) {
    for (const change of asArray(asRecord(entry).changes)) {
      const value = asRecord(asRecord(change).value);
      const contactNames = new Map<string, string>();

      for (const item of asArray(value.contacts)) {
        const contact = asRecord(item);
        const profileName = asRecord(contact.profile).name;
        if (
          typeof contact.wa_id === "string" &&
          WHATSAPP_PHONE_PATTERN.test(contact.wa_id) &&
          typeof profileName === "string" &&
          profileName.trim()
        ) {
          contactNames.set(contact.wa_id, profileName.trim().slice(0, 200));
        }
      }

      for (const item of asArray(value.messages)) {
        const message = asRecord(item);
        if (
          typeof message.id !== "string" ||
          !WHATSAPP_MESSAGE_ID_PATTERN.test(message.id) ||
          typeof message.from !== "string" ||
          !WHATSAPP_PHONE_PATTERN.test(message.from) ||
          typeof message.timestamp !== "string" ||
          !/^\d{1,16}$/.test(message.timestamp)
        ) {
          continue;
        }

        const receivedAt = new Date(Number(message.timestamp) * 1000);
        if (Number.isNaN(receivedAt.getTime())) {
          continue;
        }

        const type =
          typeof message.type === "string" && message.type.length <= 50
            ? message.type
            : "unknown";
        const text = getInboundMessageText(message);

        messages.push({
          messageId: message.id,
          fromPhone: message.from,
          profileName: contactNames.get(message.from),
          type,
          text,
          receivedAt,
        });
      }
    }
  }

  return messages;
}

function logMessageStatuses(event: unknown) {
  for (const entry of asArray(asRecord(event).entry)) {
    for (const change of asArray(asRecord(entry).changes)) {
      const value = asRecord(asRecord(change).value);
      for (const item of asArray(value.statuses)) {
        const status = asRecord(item);
        if (
          typeof status.status !== "string" ||
          !["sent", "delivered", "read", "failed"].includes(status.status)
        ) {
          continue;
        }

        // Liste blanche uniquement : jamais recipient_id, contenu, ni détails
        // libres d'erreur Meta (qui peuvent contenir des données personnelles).
        const messageId =
          typeof status.id === "string" &&
          WHATSAPP_MESSAGE_ID_PATTERN.test(status.id)
            ? status.id
            : undefined;
        const errorCodes = asArray(status.errors)
          .map((error) => asRecord(error).code)
          .filter((code): code is number =>
            typeof code === "number" && Number.isSafeInteger(code) && code >= 0,
          );
        const log = JSON.stringify({
          event: "whatsapp.message_status",
          route: "/api/webhook/whatsapp",
          status: status.status,
          messageId,
          errorCodes,
        });

        if (status.status === "failed") {
          console.error(log);
        } else {
          console.info(log);
        }
      }
    }
  }
}

function getRequiredWebhookEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Variable d'environnement manquante : ${name}`);
  }

  return value;
}

function hasValidMetaSignature(payload: string, signature: string | null) {
  if (!signature?.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = `sha256=${createHmac(
    "sha256",
    getRequiredWebhookEnv("META_APP_SECRET"),
  )
    .update(payload, "utf8")
    .digest("hex")}`;

  const received = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  return received.length === expected.length && timingSafeEqual(received, expected);
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode !== "subscribe" ||
    !challenge ||
    token !== getRequiredWebhookEnv("WHATSAPP_VERIFY_TOKEN")
  ) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(challenge, {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}

export async function POST(request: Request) {
  const payload = await request.text();

  if (!hasValidMetaSignature(payload, request.headers.get("x-hub-signature-256"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let event: unknown;
  try {
    event = JSON.parse(payload) as unknown;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  if (asRecord(event).object !== "whatsapp_business_account") {
    return new Response("Ignored", { status: 200 });
  }

  const inboundMessages = extractInboundMessages(event);
  if (inboundMessages.length > 0) {
    const { persistInboundMessages } = await import(
      "@/lib/whatsapp/inbound-messages"
    );
    await persistInboundMessages(inboundMessages);
  }

  logMessageStatuses(event);
  console.info("Webhook WhatsApp reçu et vérifié");

  return new Response("EVENT_RECEIVED", { status: 200 });
}
