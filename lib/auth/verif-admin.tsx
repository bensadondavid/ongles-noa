import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const verifAdmin = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/fr/sign-in");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/fr");
  }

  return session!;
};
