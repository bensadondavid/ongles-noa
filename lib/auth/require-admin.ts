import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

export async function requireAdmin(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}
