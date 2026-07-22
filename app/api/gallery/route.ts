import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/data/prisma";

const PAGE_SIZE = 6;

export async function GET(req: NextRequest) {
  const skip = Number(req.nextUrl.searchParams.get("skip") ?? 0);

  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take: PAGE_SIZE + 1,
  });

  const hasMore = images.length > PAGE_SIZE;

  return NextResponse.json({ images: images.slice(0, PAGE_SIZE), hasMore });
}
