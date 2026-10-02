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

export async function sendNewAppointmentPush(appointment: {
  id: string;
  startsAt: Date;
  customerName: string;
}) {
  if (!getVapidPublicKey()) return;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { user: { email: pushAdminEmail, role: "ADMIN" } },
  });
  if (subscriptions.length === 0) return;

  const date = DateTime.fromJSDate(appointment.startsAt)
    .setZone("Asia/Jerusalem")
    .setLocale("fr")
    .toFormat("cccc d LLLL 'à' HH:mm");
  const payload = JSON.stringify({
    title: "Nouveau rendez-vous",
    body: `${appointment.customerName} — ${date}`,
    tag: `appointment-${appointment.id}`,
  });

  await Promise.all(
    subscriptions.map(async ({ id, endpoint, p256dh, auth }) => {
      try {
        await webpush.sendNotification(
          { endpoint, keys: { p256dh, auth } },
          payload,
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
          console.error("Envoi de la notification de rendez-vous impossible :", error);
        }
      }
    }),
  );
}
