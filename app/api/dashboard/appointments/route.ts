import { NextRequest, NextResponse } from "next/server";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { prisma } from "@/lib/data/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

const TIME_ZONE = "Asia/Jerusalem";

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const month = req.nextUrl.searchParams.get("month");
  if (!month || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
    return NextResponse.json({ error: "Mois invalide" }, { status: 400 });
  }

  const [year, monthNumber] = month.split("-").map(Number);
  const monthStart = fromZonedTime(
    new Date(year, monthNumber - 1, 1),
    TIME_ZONE
  );
  const nextMonthStart = fromZonedTime(
    new Date(year, monthNumber, 1),
    TIME_ZONE
  );

  const appointments = await prisma.appointment.findMany({
    where: {
      startsAt: { gte: monthStart, lt: nextMonthStart },
      status: "CONFIRMED",
    },
    orderBy: { startsAt: "asc" },
    select: {
      id: true,
      startsAt: true,
      endsAt: true,
      status: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      appointmentItem: true,
      appointmentOption: true,
      message: true,
    },
  });

  return NextResponse.json({
    appointments: appointments.map((appointment) => {
      const localStart = toZonedTime(appointment.startsAt, TIME_ZONE);
      const localEnd = toZonedTime(appointment.endsAt, TIME_ZONE);

      return {
        ...appointment,
        date: format(localStart, "yyyy-MM-dd"),
        startTime: format(localStart, "HH:mm"),
        endTime: format(localEnd, "HH:mm"),
      };
    }),
  });
}
