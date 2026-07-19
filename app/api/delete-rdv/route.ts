import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/data/prisma";
import { auth } from "@/lib/auth/auth";

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

    await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

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