export const PRESTATION_CATALOG = [
  { name: "Dépose", translationKey: "presta_1" },
  { name: "Manucure et soins des ongles", translationKey: "presta_2" },
  {
    name: "Manucure russe et semi permanent",
    translationKey: "presta_3",
  },
  { name: "Manucure russe et gainage", translationKey: "presta_4" },
  { name: "Capsules gel X", translationKey: "presta_5" },
  { name: "Gel semi permanent pieds", translationKey: "presta_6" },
] as const;

export const OPTION_CATALOG = [
  { name: "Réparation d’un ongle cassé", translationKey: "option_1" },
  { name: "Pose d’un faux ongle", translationKey: "option_2" },
  { name: "French", translationKey: "option_3" },
  { name: "Baby boomer", translationKey: "option_4" },
  { name: "Effet chrome", translationKey: "option_5" },
  { name: "Stickers, pailletés, strass", translationKey: "option_6" },
  { name: "Nail art simple par ongle", translationKey: "option_7" },
  { name: "Nail art élaboré par ongle", translationKey: "option_8" },
] as const;

const prestationOrder = new Map(
  PRESTATION_CATALOG.map((item, index) => [item.name, index]),
);
const optionOrder = new Map(
  OPTION_CATALOG.map((item, index) => [item.name, index]),
);

function sortCatalogItems<T extends { name: string }>(
  items: T[],
  order: ReadonlyMap<string, number>,
) {
  return items.toSorted((first, second) => {
    const firstIndex = order.get(first.name) ?? Number.MAX_SAFE_INTEGER;
    const secondIndex = order.get(second.name) ?? Number.MAX_SAFE_INTEGER;

    return (
      firstIndex - secondIndex || first.name.localeCompare(second.name, "fr")
    );
  });
}

export function sortPrestations<T extends { name: string }>(items: T[]) {
  return sortCatalogItems(items, prestationOrder);
}

export function sortOptions<T extends { name: string }>(items: T[]) {
  return sortCatalogItems(items, optionOrder);
}

export function getPrestationTranslationKey(name: string) {
  return PRESTATION_CATALOG.find((item) => item.name === name)?.translationKey;
}

export function getOptionTranslationKey(name: string) {
  return OPTION_CATALOG.find((item) => item.name === name)?.translationKey;
}
