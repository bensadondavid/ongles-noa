import PrestationsPage from "@/components/pages/PrestationsPage";
import { verifSession } from "@/lib/auth/verif-session";


export default async function Prestations(){

  await verifSession()

  return(
    <PrestationsPage />
  )
}