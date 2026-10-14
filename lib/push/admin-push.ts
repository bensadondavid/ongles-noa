import { DateTime } from "luxon";
import webpush from "web-push";
import { prisma } from "@/lib/data/prisma";

export const pushAdminEmail = "amouyalnoa25@gmail.com";

export function getVapidPublicKey() {
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return null;

  webpush.setVapidDetails(`mailto:${pushAdminEmail}`, publicKey, privateKey);
  return publicKey;
}

type PushPayload = {
  title: string;
  body: string;
  tag: string;
  url: "/dashboard" | "/dashboard/messages";
};

async function sendAdminPush(payload: PushPayload) {
  if (!getVapidPublicKey()) return;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { user: { email: pushAdminEmail, role: "ADMIN" } },
  });
  if (subscriptions.length === 0) return;

  await Promise.all(
    subscriptions.map(async ({ id, endpoint, p256dh, auth }) => {
      try {
        await webpush.sendNotification(
          { endpoint, keys: { p256dh, auth } },
          JSON.stringify(payload),
          { TTL: 3600, timeout: 5000 },
        );
      } catch (error) {
        const statusCode =
          typeof error === "object" && error !== null && "statusCode" in error
            ? error.statusCode
            : null;
        if (statusCode === 404 || statusCode === 410) {
          await prisma.pushSubscription.deleteMany({ where: { id } });
        } else {
          console.error("Envoi de la notification impossible :", error);
        }
      }
    }),
  );
}

type AppointmentPush = {
  id: string;
  startsAt: Date;
  customerName: string;
};

function appointmentDate(appointment: AppointmentPush) {
  const date = DateTime.fromJSDate(appointment.startsAt)
    .setZone("Asia/Jerusalem")
    .setLocale("fr")
    .toFormat("cccc d LLLL 'à' HH:mm");
  return date;
}

export async function sendNewAppointmentPush(appointment: AppointmentPush) {
  await sendAdminPush({
    title: "Nouveau rendez-vous",
    body: `${appointment.customerName} — ${appointmentDate(appointment)}`,
    tag: `appointment-${appointment.id}`,
    url: "/dashboard",
  });
}

export async function sendCancelledAppointmentPush(appointment: AppointmentPush) {
  await sendAdminPush({
    title: "Rendez-vous annulé",
    body: `${appointment.customerName} — ${appointmentDate(appointment)}`,
    tag: `appointment-cancelled-${appointment.id}`,
    url: "/dashboard",
  });
}

export async function sendNewWhatsAppMessagePush(message: {
  messageId: string;
  fromPhone: string;
  profileName?: string;
}) {
  const sender = message.profileName || `+${message.fromPhone}`;
  await sendAdminPush({
    title: "Nouveau message WhatsApp",
    body: `${sender} vous a écrit.`,
    tag: `whatsapp-${message.messageId}`,
    url: "/dashboard/messages",
  });
}
