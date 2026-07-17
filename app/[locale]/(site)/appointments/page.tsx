import { prisma } from '../../../../lib/data/prisma';
import Appointment from '@/components/pages/Appointment';

export default async function Appointments() {

  const appointments = await prisma.appointment.findMany({
    where: {
      status: 'PENDING' 
    },
  })

  return (
    <Appointment appointments={appointments} />
  )
}
