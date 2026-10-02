import { verifAdmin } from "@/lib/auth/verif-admin";
import DashboardAvailability from "@/components/pages/DashboardAvailability";
import { DashboardPushControl } from "@/components/dashboard-push-control";

export default async function DashboardPage() {
  await verifAdmin();

  return (
    <>
      <DashboardAvailability />
      <DashboardPushControl />
    </>
  );
}
