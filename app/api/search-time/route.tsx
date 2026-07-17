import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import { prisma } from "@/lib/data/prisma";

const hours = ["9:00", "11:00", "13:00", "15:00", "17:00"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dateStore, prestaLength } = body;

    console.log("body reçu :", body);

    console.log("prestaLength reçu :", prestaLength);

    if (!dateStore) {
      return NextResponse.json({ error: "Date manquante" }, { status: 400 });
    }

    const selectedDate = new Date(dateStore);

    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json({ error: "Date invalide" }, { status: 400 });
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        status: {
          not: "CANCELLED",
        },
        startsAt: {
          gte: startOfDay(selectedDate),
          lte: endOfDay(selectedDate),
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
      });

      const endHour = appointment.endsAt.toLocaleTimeString("fr-FR", {
        hour: "2-digit",

        minute: "2-digit",

        hour12: false,
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
    console.log("appointments", appointments);

    console.log("occupiedHours", [...occupiedHours]);

    console.log("requiredSlots", requiredSlots);

    console.log("availableHours", availableHours);

    return NextResponse.json({ availableHours });
  } catch (error) {
    console.error("search-time error:", error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
