import PrestationsPage from "@/components/pages/PrestationsPage";
import { verifSession } from "@/lib/auth/verif-session";
import { prisma } from "@/lib/data/prisma";
import { sortPrestations } from "@/lib/services/catalog";

export default async function Prestations() {
  await verifSession();

  const prestations = sortPrestations(
    await prisma.prestations.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true },
    }),
  );

  return <PrestationsPage prestations={prestations} />;
}
