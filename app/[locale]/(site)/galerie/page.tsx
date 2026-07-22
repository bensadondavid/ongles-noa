import { prisma } from "@/lib/data/prisma";
import GalleryPage from "@/components/pages/GalleryPage";

const PAGE_SIZE = 5;

export default async function Galerie() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE + 1,
  });

  const hasMore = images.length > PAGE_SIZE;

  return (
    <GalleryPage
      initialImages={images.slice(0, PAGE_SIZE)}
      initialHasMore={hasMore}
    />
  );
}
