import { verifAdmin } from "@/lib/auth/verif-admin";
import DashboardAvailability from "@/components/pages/DashboardAvailability";
import DashboardHeader from "@/components/pages/DashboardHeader";

export default async function DashboardPage() {
  const session = await verifAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader userName={session.user.name} />
      <DashboardAvailability />
    </div>
  );
}
