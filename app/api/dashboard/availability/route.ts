import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { prisma } from "@/lib/data/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

const TIME_ZONE = "Asia/Jerusalem";

function parseDateStr(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

// Bornes du jour calendaire israélien en instants UTC. On recalcule chaque
// borne via fromZonedTime plutôt que d'ajouter 24h en millisecondes, car les
// jours de changement d'heure en Israël durent 23h ou 25h (sinon la borne de
// fin déborde sur le jour suivant lors du passage à l'heure d'été).
function dayRange(dateStr: string) {
  const parsed = parseDateStr(dateStr);
  if (!parsed) return null;
  const { year, month, day } = parsed;
  const start = fromZonedTime(new Date(year, month - 1, day), TIME_ZONE);
  const end = fromZonedTime(new Date(year, month - 1, day + 1), TIME_ZONE);
  return { start, end };
}

function timeToMin(time: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const month = req.nextUrl.searchParams.get("month");
  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Mois invalide" }, { status: 400 });
  }

  const [year, monthNum] = month.split("-").map(Number);
  const monthDate = new Date(year, monthNum - 1, 1);
  const monthStart = fromZonedTime(startOfMonth(monthDate), TIME_ZONE);
  const monthEnd = fromZonedTime(endOfMonth(monthDate), TIME_ZONE);

  const rules = await prisma.availabilityRule.findMany({
    where: { date: { gte: monthStart, lte: monthEnd } },
    orderBy: [{ date: "asc" }, { startMin: "asc" }],
  });

  const result = rules.map((rule) => ({
    id: rule.id,
    date: format(toZonedTime(rule.date, TIME_ZONE), "yyyy-MM-dd"),
    startMin: rule.startMin,
    endMin: rule.endMin,
  }));

  return NextResponse.json({ rules: result });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const body = await req.json();
  const { date, startTime, endTime } = body;

  if (typeof date !== "string" || !parseDateStr(date)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const startMin = typeof startTime === "string" ? timeToMin(startTime) : null;
  const endMin = typeof endTime === "string" ? timeToMin(endTime) : null;

  if (startMin === null || endMin === null || startMin >= endMin) {
    return NextResponse.json(
      { error: "Plage horaire invalide" },
      { status: 400 }
    );
  }

  const range = dayRange(date);
  if (!range) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }
  const instant = range.start;

  const existingRules = await prisma.availabilityRule.findMany({
    where: { date: { gte: range.start, lt: range.end } },
  });

  const overlaps = existingRules.some(
    (rule) => startMin < rule.endMin && endMin > rule.startMin
  );
  if (overlaps) {
    return NextResponse.json(
      { error: "Cette plage chevauche une plage existante" },
      { status: 409 }
    );
  }

  const rule = await prisma.availabilityRule.create({
    data: { date: instant, startMin, endMin },
  });

  return NextResponse.json({
    rule: { id: rule.id, date, startMin: rule.startMin, endMin: rule.endMin },
  });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const date = req.nextUrl.searchParams.get("date");
  if (!date || !parseDateStr(date)) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  const range = dayRange(date);
  if (!range) {
    return NextResponse.json({ error: "Date invalide" }, { status: 400 });
  }

  await prisma.availabilityRule.deleteMany({
    where: { date: { gte: range.start, lt: range.end } },
  });

  return NextResponse.json({ message: "Journée fermée" });
}
