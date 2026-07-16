import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";
import { prisma } from "@/lib/data/prisma";

const hours = ["9:00", "11:00", "13:00", "15:00", "17:00"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dateStore, prestaLength } = body;

    if (!dateStore) {
      return NextResponse.json(
        { error: "Date manquante" },
        { status: 400 }
      );
    }

    const selectedDate = new Date(dateStore);

    if (Number.isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { error: "Date invalide" },
        { status: 400 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: {
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

    const occupiedHours = new Set(
      appointments.map((appointment) =>
        appointment.startsAt.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      )
    );

    const availableHours = hours.filter((hour, index) => {
      if (index + requiredSlots > hours.length) {
        return false;
      }

      for (let i = 0; i < requiredSlots; i++) {
        const slot = hours[index + i];

        if (occupiedHours.has(slot.padStart(5, "0"))) {
          return false;
        }
      }

      return true;
    });

    return NextResponse.json({ availableHours });
  } catch (error) {
    console.error("search-time error:", error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}