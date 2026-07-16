import { prisma } from "@/lib/data/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon";
import { auth } from "@/lib/auth/auth";

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
    const { date, time, prestations, options, message } = body;

    if (!date || !time) {
      return NextResponse.json(
        { error: "Date ou heure manquante" },
        { status: 400 }
      );
    }

    if (!Array.isArray(prestations) || prestations.length === 0) {
      return NextResponse.json(
        { error: "Aucune prestation sélectionnée" },
        { status: 400 }
      );
    }

    const dateOnly = date.split("T")[0];
    const startDateTime = DateTime.fromISO(`${dateOnly}T${time}`, {
    zone: "Asia/Jerusalem",
    });

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

    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        startsAt: {
          lt: endsAt,
        },
        endsAt: {
          gt: startsAt,
        },
      },
    });

    if (conflictingAppointment) {
      return NextResponse.json(
        { error: "Ce créneau n'est plus disponible" },
        { status: 409 }
      ); 
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        userId: user.id,
        appointmentItem: prestations,
        appointmentOption: options,
        startsAt,
        endsAt,
        message,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone || "",
      },
    });

    return NextResponse.json(
      {
        message: "Appointment created",
        appointment: newAppointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}