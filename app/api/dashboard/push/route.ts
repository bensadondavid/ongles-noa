import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/data/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getVapidPublicKey, pushAdminEmail } from "@/lib/push/admin-push";

const subscriptionSchema = z.object({
  endpoint: z.url().max(2048),
  keys: z.object({
    p256dh: z.string().regex(/^[A-Za-z0-9_-]+$/).max(256),
    auth: z.string().regex(/^[A-Za-z0-9_-]+$/).max(256),
  }),
});

async function authorizedAdmin(req: NextRequest) {
  const session = await requireAdmin(req);
  return session?.user.email.toLowerCase() === pushAdminEmail ? session : null;
}

function validOrigin(req: NextRequest) {
  return req.headers.get("origin") === req.nextUrl.origin;
}

function applePushEndpoint(endpoint: string) {
  const url = new URL(endpoint);
  return url.protocol === "https:" && url.hostname.endsWith(".push.apple.com");
}

export async function GET(req: NextRequest) {
  if (!(await authorizedAdmin(req))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }
  const publicKey = getVapidPublicKey();
  if (!publicKey) {
    return NextResponse.json({ error: "Notifications non configurées" }, { status: 503 });
  }
  return NextResponse.json({ publicKey });
}

export async function POST(req: NextRequest) {
  const session = await authorizedAdmin(req);
  if (!session) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  if (!validOrigin(req)) return NextResponse.json({ error: "Origine invalide" }, { status: 403 });
  if (!getVapidPublicKey()) {
    return NextResponse.json({ error: "Notifications non configurées" }, { status: 503 });
  }

  const result = subscriptionSchema.safeParse(await req.json().catch(() => null));
  if (!result.success || !applePushEndpoint(result.data.endpoint)) {
    return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });
  }

  const { endpoint, keys } = result.data;
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: { userId: session.user.id, endpoint, ...keys },
    update: { userId: session.user.id, ...keys },
  });
  return NextResponse.json({ subscribed: true });
}

export async function DELETE(req: NextRequest) {
  const session = await authorizedAdmin(req);
  if (!session) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  if (!validOrigin(req)) return NextResponse.json({ error: "Origine invalide" }, { status: 403 });

  const result = z.object({ endpoint: z.url().max(2048) }).safeParse(await req.json().catch(() => null));
  if (!result.success) return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });
  await prisma.pushSubscription.deleteMany({
    where: { endpoint: result.data.endpoint, userId: session.user.id },
  });
  return NextResponse.json({ subscribed: false });
}
