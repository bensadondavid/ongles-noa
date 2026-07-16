
import { prisma } from "@/lib/data/prisma";
import { NextRequest, NextResponse } from "next/server";
import { DateTime } from "luxon"
import { auth } from "@/lib/auth/auth";

export async function POST(req:NextRequest){

    const session = await auth.api.getSession({
        headers: req.headers
    })
    if(!session){
        return NextResponse.json({error : "Session introuvable"}, {status: 401})
    }
    
    const user = session.user
    
    const body = await req.json()
    const { date, time, prestations, options, message } = body
    const startsAt = DateTime.fromISO(`${date}T${time}`, {zone: "Asia/Jerusalem"}).toUTC().toJSDate()
    const durationMin = prestations.length * 120
    const endsAt = new Date(startsAt.getTime() + durationMin * 60 * 1000)
    

    const newAppointment = await prisma.appointment.create({
        data: {
            userId : user.id,
            prestations,
            options,    
            startsAt, 
            endsAt,
            message,
            customerName : user.name,
            customerEmail : user.email,
            customerPhone: user.phone || "",
        }
    })
    return NextResponse.json({message: "appointment created"}, {status: 200})
}