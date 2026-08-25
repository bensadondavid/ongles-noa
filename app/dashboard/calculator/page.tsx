import Calculator from "@/components/pages/Calculator";
import { verifAdmin } from "@/lib/auth/verif-admin";
import { prisma } from "@/lib/data/prisma";
import { sortOptions, sortPrestations } from "@/lib/services/catalog";

export default async function CalculatorPage() {
  await verifAdmin();

  const [unsortedServices, unsortedOptions] = await Promise.all([
    prisma.prestations.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true },
    }),
    prisma.options.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true },
    }),
  ]);

  return (
    <Calculator
      services={sortPrestations(unsortedServices)}
      options={sortOptions(unsortedOptions)}
    />
  );
}
