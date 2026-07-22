import { verifAdmin } from "@/lib/auth/verif-admin";
import ImagesPage from "@/components/pages/ImagesPage";

export default async function AddImage() {
  await verifAdmin();

  return <ImagesPage />;
}
