import { createHmac, timingSafeEqual } from "node:crypto";

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
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
          /^wamid\.[A-Za-z0-9+/=_-]{1,512}$/.test(status.id)
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

  // Aucun appel réseau ou base de données : accusé de réception rapide.
  if (asRecord(event).object !== "whatsapp_business_account") {
    return new Response("Ignored", { status: 200 });
  }

  logMessageStatuses(event);
  console.info("Webhook WhatsApp reçu et vérifié");

  return new Response("EVENT_RECEIVED", { status: 200 });
}
