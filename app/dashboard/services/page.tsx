import { prisma } from "@/lib/data/prisma";
import Services from "@/components/pages/services";
import { verifAdmin } from "@/lib/auth/verif-admin";
import { sortOptions, sortPrestations } from "@/lib/services/catalog";

export default async function ServicesPage() {
  await verifAdmin();

  const [unsortedServices, unsortedOptions] = await Promise.all([
    prisma.prestations.findMany({
      select: { id: true, name: true, price: true, isActive: true },
    }),
    prisma.options.findMany({
      select: { id: true, name: true, price: true, isActive: true },
    }),
  ]);

  const services = sortPrestations(unsortedServices);
  const options = sortOptions(unsortedOptions);

  return <Services services={services} options={options} />;
}
