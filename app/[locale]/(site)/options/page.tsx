import OptionsPage from "@/components/pages/OptionsPage";
import { verifSession } from "@/lib/auth/verif-session";
import { prisma } from "@/lib/data/prisma";
import { sortOptions } from "@/lib/services/catalog";

export default async function Options() {
  await verifSession();

  const options = sortOptions(
    await prisma.options.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true },
    }),
  );

  return <OptionsPage options={options} />;
}
