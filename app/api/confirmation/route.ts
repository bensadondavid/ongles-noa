import { prisma } from "@/lib/data/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { auth } from "@/lib/auth/auth";
import { z } from "zod";
import { isSlotAvailable } from "@/lib/booking/is-slot-available";

const prestationSchema = z.object({
  name: z.string().min(1),
});
const optionSchema = z.object({
  name: z.string().min(1),
});
const confirmationSchema = z.object({
  date: z.string().min(1, "Date manquante"),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure invalide"),
  prestations: z
    .array(prestationSchema)
    .min(1, "Aucune prestation sélectionnée"),
  options: z.array(optionSchema),
  message: z
    .string()
    .trim()
    .max(1000, "Message trop long")
    .nullable()
    .optional()
});


export async function POST(req: NextRequest) {

  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session introuvable" },
        { status: 401 }
      );
    }

    const user = session.user;

    const body = await req.json();

    const result = confirmationSchema.safeParse(body);
      if (!result.success) {
        return NextResponse.json(
          {
            error: "Données invalides",
            details: result.error.flatten().fieldErrors,
          },
          { status: 400 }
        );
      }
    const { date, time, prestations, options, message } = result.data;

    const slotAvailable = await isSlotAvailable({
      date,
      time,
      prestationCount: prestations.length,
    });

    if (!slotAvailable) {
      return NextResponse.json(
        { error: "Ce créneau n'est pas disponible" },
        { status: 409 }
      );
    }

    const selectedDate = DateTime.fromISO(date, {
  zone: "Asia/Jerusalem",
});

const [hour, minute = "0"] = time.split(":");
const startDateTime = DateTime.fromObject(
  {
    year: selectedDate.year,
    month: selectedDate.month,
    day: selectedDate.day,
    hour: Number(hour),
    minute: Number(minute),
  },
  {
    zone: "Asia/Jerusalem",
  }
);

    if (!startDateTime.isValid) {
      return NextResponse.json(
        { error: "Date ou heure invalide" },
        { status: 400 }
      );
    }

    const startsAt = startDateTime.toUTC().toJSDate();

    const durationMin = prestations.length * 120;

    const endsAt = new Date(
      startsAt.getTime() + durationMin * 60 * 1000
    );


   const newAppointment = await prisma.$transaction(
      async (tx) => {
        const conflictingAppointment = await tx.appointment.findFirst({
          where: {
            startsAt: {
              lt: endsAt,
            },
            endsAt: {
              gt: startsAt,
            },
            status: {
              not: "CANCELLED",
            },
          },
        });
        if (conflictingAppointment) {
          throw new Error("SLOT_ALREADY_BOOKED");
        }
        return tx.appointment.create({
          data: {
            userId: user.id,
            appointmentItem: prestations,
            appointmentOption: options ,
            startsAt,
            endsAt,
            message,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone || "",
            status: "CONFIRMED"
          },
        });
      },
      {
        isolationLevel: "Serializable",
      }
    );

    return NextResponse.json(
      {
        message: "Appointment created",
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
      if (
        error instanceof Error &&
        error.message === "SLOT_ALREADY_BOOKED"
      ) {
        return NextResponse.json(
          { error: "Ce créneau vient d'être réservé" },
          { status: 409 }
        );
      }
      console.error(error);
      return NextResponse.json(
        { error: "Erreur serveur" },
        { status: 500 }
      );
    }
}