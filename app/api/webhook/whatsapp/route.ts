import { createHmac, timingSafeEqual } from "node:crypto";

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

  // L'accusé de réception doit être rapide. Les statuts sont visibles dans les
  // logs Vercel sans journaliser le corps complet ni les données du client.
  if (
    typeof event === "object" &&
    event !== null &&
    "object" in event &&
    event.object !== "whatsapp_business_account"
  ) {
    return new Response("Ignored", { status: 200 });
  }

  console.info("Webhook WhatsApp reçu et vérifié");

  return new Response("EVENT_RECEIVED", { status: 200 });
}
