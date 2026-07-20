import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { startOfDay, endOfDay } from "date-fns";
import { prisma } from "@/lib/data/prisma";
import { auth } from "@/lib/auth/auth";

const SLOT_MIN = 120;
const TIME_ZONE = "Asia/Jerusalem";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { dateStore, prestaLength } = body;

    if (!dateStore) {
      return NextResponse.json({ error: "Date manquante" }, { status: 400 });
    }

    const selectedDate = new Date(dateStore);
    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    // Date calendaire en heure d'Israël (pour reconstruire les instants candidats)
    const israelDate = toZonedTime(selectedDate, TIME_ZONE);
    const year = israelDate.getFullYear();
    const month = israelDate.getMonth();
    const day = israelDate.getDate();

    const dayStart = fromZonedTime(startOfDay(israelDate), TIME_ZONE);
    const dayEnd = fromZonedTime(endOfDay(israelDate), TIME_ZONE);

    const availabilityRules = await prisma.availabilityRule.findMany({
      where: { date: { gte: dayStart, lte: dayEnd } },
      orderBy: { startMin: "asc" },
    });

    const appointments = await prisma.appointment.findMany({
      where: {
        status: { in: ["PENDING", 'CONFIRMED'] },
        startsAt: { gte: dayStart, lte: dayEnd },
      },
      select: { startsAt: true, endsAt: true },
      orderBy: { startsAt: "asc" },
    });

    const requiredSlots = Math.max(Number(prestaLength) || 1, 1);
    const duration = requiredSlots * SLOT_MIN;

    // Instant "maintenant" en Israël pour filtrer les créneaux déjà passés
    const nowUtc = new Date();
    const nowIsrael = toZonedTime(nowUtc, TIME_ZONE);
    const isToday =
      nowIsrael.getFullYear() === year &&
      nowIsrael.getMonth() === month &&
      nowIsrael.getDate() === day;
    const nowMin = nowIsrael.getHours() * 60 + nowIsrael.getMinutes();

    // Convertit un "minutes depuis minuit" (heure locale Israël) en instant réel
    const minToInstant = (min: number) =>
      fromZonedTime(
        new Date(year, month, day, Math.floor(min / 60), min % 60),
        TIME_ZONE,
      );

    const availableHours: string[] = [];

    for (const rule of availabilityRules) {
      for (let start = rule.startMin; start < rule.endMin; start += SLOT_MIN) {
        // 1. Créneaux passés (aujourd'hui uniquement)
        if (isToday && start <= nowMin) continue;

        const fitsInThisRule =
          start >= rule.startMin &&  start + duration <= rule.endMin;
        if (!fitsInThisRule) continue;

        // 3. Conflit avec un rendez-vous existant — comparaison d'instants (DST-safe)
        const candidateStart = minToInstant(start);
        const candidateEnd = minToInstant(start + duration);

        const hasConflict = appointments.some(
          (appt) =>
            candidateStart < appt.endsAt && candidateEnd > appt.startsAt,
        );

        if (!hasConflict) {
          const h = String(Math.floor(start / 60)).padStart(2, "0");
          const m = String(start % 60).padStart(2, "0");
          availableHours.push(`${h}:${m}`);
        }
      }
    }

    return NextResponse.json({ availableHours });
  } catch (error) {
    console.error("search-time error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}