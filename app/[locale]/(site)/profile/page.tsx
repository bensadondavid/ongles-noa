import Infos from "@/components/pages/ProfilePage";
import { verifSession } from "@/lib/auth/verif-session";


export default async function Profile(){

  await verifSession()

  return(
    <Infos />
  )
}