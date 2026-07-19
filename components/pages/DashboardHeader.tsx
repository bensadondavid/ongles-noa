"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

export default function DashboardHeader({ userName }: { userName: string }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/fr/sign-in");
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
      <div>
        <p className="font-primary text-sm text-white/60">Tableau de bord</p>
        <p className="font-primary text-lg text-white">{userName}</p>
      </div>
      <Button variant="ghost" onClick={handleSignOut}>
        <LogOut className="size-4" />
        Déconnexion
      </Button>
    </header>
  );
}
