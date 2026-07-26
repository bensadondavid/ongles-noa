import ConfirmationPage from "@/components/pages/ConfirmationPage";
import { verifSession } from "@/lib/auth/verif-session";

export default async function Confirmation(){

  const session = await verifSession()
  const phone = session.user.phone ?? "";

  return(
    <ConfirmationPage phone={phone} />
  )
  
}