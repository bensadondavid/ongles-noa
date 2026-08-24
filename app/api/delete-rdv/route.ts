import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/data/prisma";
import { auth } from "@/lib/auth/auth";
import { cancelAppointmentReminder } from "@/lib/inngest/reminders";

const CANCELLATION_DEADLINE_MS = 48 * 60 * 60 * 1000;

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    })
    if(!session){
      return NextResponse.json({error: 'Invalid Session'}, {status: 401})
    }
    const body = await req.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID du rendez-vous invalide" },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findFirst({
      where: {
        id,
        userId: session.user.id,
        status: {
          not: "CANCELLED",
        },
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Rendez-vous introuvable" },
        { status: 404 }
      );
    }
    if (
      appointment.startsAt.getTime() - Date.now() <=
      CANCELLATION_DEADLINE_MS
    ) {
      return NextResponse.json(
        {
          error: "CANCELLATION_DEADLINE",
        },
        { status: 400 }
      );
    }
    await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date()
      },
    });

    try {
      await cancelAppointmentReminder(appointment.id);
    } catch (error) {
      // Le statut en base reste la source de vérité pour empêcher le rappel.
      console.error("Impossible d'annuler le rappel Inngest :", error);
    }

    return NextResponse.json(
      { message: "Rendez-vous annulé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'annulation du rendez-vous :", error);

    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}
