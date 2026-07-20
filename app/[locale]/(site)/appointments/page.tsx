import { prisma } from '../../../../lib/data/prisma';
import Appointment from '@/components/pages/Appointment';
import { verifSession } from '@/lib/auth/verif-session';

export default async function Appointments() {

  const session = await verifSession()
  const now = new Date()
  const appointments = await prisma.appointment.findMany({
    where: {
      status: {
        in: ['CONFIRMED', "PENDING"]
      },
      endsAt: {
        gte: now
      },
      userId : session.user.id
    },
    orderBy:{
      startsAt: "asc"
    }
  })

  return (
    <Appointment appointments={appointments} />
  )
}
