import { prisma } from '../../../../lib/data/prisma';

export default async function Appointment() {

  const appointments = await prisma.appointment.findFirst({
    where: {
      status: 'PENDING' 
    },
    
  })

  return (

    <div>
        {appointments?.startsAt.getHours()}
    </div>
  )
}
