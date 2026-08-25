import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/data/prisma";

const updateServiceSchema = z
  .object({
    kind: z.enum(["service", "option"]),
    price: z.number().int().min(0).max(100_000),
    isActive: z.boolean(),
  })
  .strict();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await requireAdmin(request);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const result = updateServiceSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!result.success) {
    return NextResponse.json(
      { error: "Le prix ou l’état est invalide" },
      { status: 400 },
    );
  }

  const { id } = await params;
  const { kind, price, isActive } = result.data;

  const existing =
    kind === "service"
      ? await prisma.prestations.findUnique({ where: { id } })
      : await prisma.options.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json(
      {
        error:
          kind === "service" ? "Prestation introuvable" : "Option introuvable",
      },
      { status: 404 },
    );
  }

  const item =
    kind === "service"
      ? await prisma.prestations.update({
          where: { id },
          data: { price, isActive },
          select: { id: true, name: true, price: true, isActive: true },
        })
      : await prisma.options.update({
          where: { id },
          data: { price, isActive },
          select: { id: true, name: true, price: true, isActive: true },
        });

  return NextResponse.json({ item });
}
