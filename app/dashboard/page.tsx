import { verifAdmin } from "@/lib/auth/verif-admin";
import DashboardAvailability from "@/components/pages/DashboardAvailability";

export default async function DashboardPage() {
  await verifAdmin();

  return (
      <DashboardAvailability />
  );
}
