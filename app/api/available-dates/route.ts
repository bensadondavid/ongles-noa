import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/data/prisma";
import { auth } from "@/lib/auth/auth";

const TIME_ZONE = "Asia/Jerusalem";
const SLOT_MIN = 120;

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
  }

  const month = req.nextUrl.searchParams.get("month");
  const prestationCount = Number(req.nextUrl.searchParams.get("prestaLength"));
  if (
    !month ||
    !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
    !Number.isInteger(prestationCount) ||
    prestationCount < 1
  ) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const monthStart = DateTime.fromISO(`${month}-01`, { zone: TIME_ZONE });
  if (!monthStart.isValid) {
    return NextResponse.json({ error: "Mois invalide" }, { status: 400 });
  }
  const monthEnd = monthStart.plus({ months: 1 });
  const startUtc = monthStart.toUTC().toJSDate();
  const endUtc = monthEnd.toUTC().toJSDate();

  const [rules, appointments] = await Promise.all([
    prisma.availabilityRule.findMany({
      where: { date: { gte: startUtc, lt: endUtc } },
    }),
    prisma.appointment.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        startsAt: { lt: endUtc },
        endsAt: { gt: startUtc },
      },
      select: { startsAt: true, endsAt: true },
    }),
  ]);

  const now = DateTime.now().setZone(TIME_ZONE);
  const durationMin = prestationCount * SLOT_MIN;
  const availableDates = new Set<string>();

  for (const rule of rules) {
    const localDate = DateTime.fromJSDate(rule.date).setZone(TIME_ZONE);
    if (localDate.startOf("day") <= now.startOf("day")) continue;

    for (let start = rule.startMin; start + durationMin <= rule.endMin; start += SLOT_MIN) {
      const candidateStart = localDate.set({
        hour: Math.floor(start / 60),
        minute: start % 60,
        second: 0,
        millisecond: 0,
      });
      const end = start + durationMin;
      const candidateEnd =
        end === 1440
          ? localDate.plus({ days: 1 }).startOf("day")
          : localDate.set({
              hour: Math.floor(end / 60),
              minute: end % 60,
              second: 0,
              millisecond: 0,
            });
      const hasConflict = appointments.some(
        (appointment) =>
          candidateStart.toMillis() < appointment.endsAt.getTime() &&
          candidateEnd.toMillis() > appointment.startsAt.getTime(),
      );

      if (!hasConflict) {
        availableDates.add(localDate.toFormat("yyyy-MM-dd"));
        break;
      }
    }
  }

  return NextResponse.json(
    { availableDates: [...availableDates] },
    { headers: { "Cache-Control": "no-store" } },
  );
}
