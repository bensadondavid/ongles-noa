import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/data/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const { id } = await params;

  const rule = await prisma.availabilityRule.findUnique({ where: { id } });
  if (!rule) {
    return NextResponse.json({ error: "Plage introuvable" }, { status: 404 });
  }

  await prisma.availabilityRule.delete({ where: { id } });

  return NextResponse.json({ message: "Plage supprimée" });
}
