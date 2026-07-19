import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/data/prisma";
import { auth } from "@/lib/auth/auth";

const hours = ["9:00", "11:00", "13:00", "15:00", "17:00"];

export async function POST(req: NextRequest) {

  const session = await auth.api.getSession({
        headers: req.headers
      })
      if(!session){
        return NextResponse.json({error: 'Invalid Session'}, {status: 401})
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

    const timeZone = "Asia/Jerusalem";

    const israelDate = toZonedTime(selectedDate, timeZone);

    const dayStart = fromZonedTime(
      startOfDay(israelDate),
      timeZone
    );

    const dayEnd = fromZonedTime(
      endOfDay(israelDate),
      timeZone
    );

    const appointments = await prisma.appointment.findMany({
      where: {
        status: {
          not: "CANCELLED",
        },
        startsAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: {
        startsAt: true,
        endsAt: true,
      },
      orderBy: {
        startsAt: "asc",
      },
    });

    const requiredSlots = Math.max(Number(prestaLength) || 1, 1);

    const occupiedHours = new Set<string>();

    appointments.forEach((appointment) => {

      const startHour = appointment.startsAt.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Jerusalem",
        });

        const endHour = appointment.endsAt.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Jerusalem",
        });

      const startIndex = hours.findIndex(
        (hour) => hour.padStart(5, "0") === startHour,
      );

      const endIndex = hours.findIndex(
        (hour) => hour.padStart(5, "0") === endHour,
      );

      if (startIndex === -1) {
        return;
      }

      const occupiedUntil = endIndex === -1 ? hours.length : endIndex;

      for (let i = startIndex; i < occupiedUntil; i++) {
        occupiedHours.add(hours[i].padStart(5, "0"));
      }
    });

    const availableHours = hours.filter((hour, index) => {
      if (index + requiredSlots > hours.length) {
        return false;
      }

      for (let i = 0; i < requiredSlots; i++) {
        const slot = hours[index + i].padStart(5, "0");

        if (occupiedHours.has(slot)) {
          return false;
        }
      }

      return true;
    });

    return NextResponse.json({ availableHours });
  } catch (error) {
    console.error("search-time error:", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
