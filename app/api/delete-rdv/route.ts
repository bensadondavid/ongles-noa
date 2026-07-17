import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/data/prisma";

export async function DELETE(req: NextRequest){

    const body = await req.json()
    const { id } = body

    await prisma.appointment.update({
        where: {
            id
        },
        data: {
            status: "CANCELLED"
        }
    })
    return NextResponse.json({message: 'Suppression effectuée'}, {status: 200})
}