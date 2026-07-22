import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/data/prisma";
import { requireAdmin } from "@/lib/auth/require-admin";

const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function GET(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const formData = await req.formData();
  const files = formData.getAll("file");

  if (files.length === 0 || !files.every((file) => file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Format d'image non supporté" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Image trop volumineuse (max 8 Mo)" }, { status: 400 });
    }
  }

  const images = await Promise.all(
    files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
      });

      return prisma.image.create({
        data: { url: blob.url, name: file.name },
      });
    })
  );

  return NextResponse.json({ images });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  }

  const image = await prisma.image.findUnique({ where: { id } });
  if (!image) {
    return NextResponse.json({ error: "Image introuvable" }, { status: 404 });
  }

  await del(image.url);
  await prisma.image.deleteMany({ where: { id } });

  return NextResponse.json({ message: "Image supprimée" });
}
