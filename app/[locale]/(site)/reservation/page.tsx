import Reservations from "@/components/pages/Reservations"
import { verifSession } from "@/lib/auth/verif-session"

export default async function Reservation(){

    await verifSession()

    return(
        <Reservations />
    )
}