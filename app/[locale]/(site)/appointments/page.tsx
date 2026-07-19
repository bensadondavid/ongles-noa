import { prisma } from '../../../../lib/data/prisma';
import Appointment from '@/components/pages/Appointment';
import { verifSession } from '@/lib/auth/verif-session';

export default async function Appointments() {

  const session = await verifSession()
  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'PENDING', 
      userId : session.user.id
    },
  })

  return (
    <Appointment appointments={appointments} />
  )
}
