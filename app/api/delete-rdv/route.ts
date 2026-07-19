import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/data/prisma";
import { verifSession } from "@/lib/auth/verif-session";

export async function DELETE(req: NextRequest){

    const session = await verifSession()
    const body = await req.json()
    const { id } = body

    await prisma.appointment.update({
        where: {
            id,
            userId: session.user.id
        },
        data: {
            status: "CANCELLED"
        }
    })
    return NextResponse.json({message: 'Suppression effectuée'}, {status: 200})
}