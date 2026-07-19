import ConfirmationPage from "@/components/pages/ConfirmationPage";
import { verifSession } from "@/lib/auth/verif-session";

export default async function Confirmation(){

  await verifSession()

  return(
    <ConfirmationPage />
  )
  
}