import { prisma } from "@/lib/data/prisma";
import { DateTime } from "luxon";

const SLOT_MIN = 120;
const TIME_ZONE = "Asia/Jerusalem";

type IsSlotAvailableParams = {
  date: string;
  time: string;
  prestationCount: number;
};

export async function isSlotAvailable({
  date,
  time,
  prestationCount,
}: IsSlotAvailableParams): Promise<boolean> {
  if (prestationCount <= 0) {
    return false;
  }

  // On reconstruit la date + heure directement dans le fuseau israélien
  const startDateTime = DateTime.fromISO(`${date}T${time}`, {
    zone: TIME_ZONE,
  });

  if (!startDateTime.isValid) {
    return false;
  }

  // Empêche de réserver dans le passé
  const now = DateTime.now().setZone(TIME_ZONE);

  if (startDateTime <= now) {
    return false;
  }

  // Chaque prestation dure 2 heures
  const durationMin = prestationCount * SLOT_MIN;

  // Exemple : 11h = 660 minutes depuis minuit
  const startMin =
    startDateTime.hour * 60 +
    startDateTime.minute;

  // Heure de début du dernier créneau nécessaire
  // 2 prestations à 11h => créneaux 11h et 13h

  // Début et fin du jour en Israël,
  // convertis en UTC pour interroger PostgreSQL
  const dayStart = startDateTime
    .startOf("day")
    .toUTC()
    .toJSDate();

  const dayEnd = startDateTime
    .endOf("day")
    .toUTC()
    .toJSDate();

  // On récupère les règles de disponibilité de ce jour
  const availabilityRules =
    await prisma.availabilityRule.findMany({
      where: {
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      orderBy: {
        startMin: "asc",
      },
    });

  // Le créneau doit correspondre à au moins une plage disponible
  return availabilityRules.some((rule) => {
    // Vérifie que l'heure demandée correspond bien
    // à un créneau de 2h à partir du début de la règle
    const isAlignedWithSlotGrid =
      startMin >= rule.startMin &&
      (startMin - rule.startMin) % SLOT_MIN === 0;

    // Vérifie que toutes les prestations tiennent
    // dans la plage de disponibilité
    const fitsInRule =
      startMin >= rule.startMin &&
      startMin + durationMin <= rule.endMin;
    return isAlignedWithSlotGrid && fitsInRule;
  });
}