import OptionsPage from "@/components/pages/OptionsPage"
import { verifSession } from "@/lib/auth/verif-session"

export default async function Options(){

  await verifSession()

  return(
    <OptionsPage />
  )
}