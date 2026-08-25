
"use client";

import { useMemo, useState } from "react";
import {
  CalculatorIcon,
  Check,
  Minus,
  Plus,
  ReceiptText,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type CatalogItem = {
  id: string;
  name: string;
  price: number;
};

type CalculatorProps = {
  services: CatalogItem[];
  options: CatalogItem[];
};

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

function formatPrice(price: number) {
  return currencyFormatter.format(price);
}

type SelectableItemProps = {
  item: CatalogItem;
  selected: boolean;
  onToggle: () => void;
};

function SelectableItem({ item, selected, onToggle }: SelectableItemProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={`group flex min-h-16 w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors sm:px-4 ${
        selected
          ? "border-white/45 bg-white/20"
          : "border-white/10 bg-white/7 hover:bg-white/12"
      }`}
    >
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
          selected
            ? "border-white bg-white text-border"
            : "border-white/35 text-transparent group-hover:border-white/60"
        }`}
      >
        <Check className="size-3.5" strokeWidth={3} />
      </span>
      <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-white">
        {item.name}
      </span>
      <span className="shrink-0 text-sm font-semibold text-white/75">
        {formatPrice(item.price)}
      </span>
    </button>
  );
}

type OptionItemProps = SelectableItemProps & {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
};

function OptionItem({
  item,
  selected,
  onToggle,
  quantity,
  onQuantityChange,
}: OptionItemProps) {
  return (
    <div
      className={`rounded-2xl border transition-colors ${
        selected
          ? "border-white/45 bg-white/20"
          : "border-white/10 bg-white/7 hover:bg-white/12"
      }`}
    >
      <button
        type="button"
        aria-pressed={selected}
        onClick={onToggle}
        className="group flex min-h-16 w-full items-center gap-3 px-3 py-3 text-left sm:px-4"
      >
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
            selected
              ? "border-white bg-white text-border"
              : "border-white/35 text-transparent group-hover:border-white/60"
          }`}
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug text-white">
          {item.name}
        </span>
        <span className="shrink-0 text-sm font-semibold text-white/75">
          {formatPrice(item.price)}
        </span>
      </button>

      {selected && (
        <div className="flex items-center justify-between border-t border-white/10 px-3 py-2.5 sm:px-4">
          <span className="text-xs text-white/65">Quantité</span>
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label={`Quantité pour ${item.name}`}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="rounded-full text-white hover:bg-white/15 hover:text-white"
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              disabled={quantity === 1}
              aria-label={`Diminuer la quantité de ${item.name}`}
            >
              <Minus />
            </Button>
            <span className="w-7 text-center text-sm font-semibold text-white">
              {quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="rounded-full text-white hover:bg-white/15 hover:text-white"
              onClick={() => onQuantityChange(Math.min(10, quantity + 1))}
              disabled={quantity === 10}
              aria-label={`Augmenter la quantité de ${item.name}`}
            >
              <Plus />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Calculator({ services, options }: CalculatorProps) {
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    () => new Set(),
  );
  const [selectedOptions, setSelectedOptions] = useState<Map<string, number>>(
    () => new Map(),
  );

  const toggleService = (id: string) => {
    setSelectedServices((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleOption = (id: string) => {
    setSelectedOptions((current) => {
      const next = new Map(current);
      if (next.has(id)) next.delete(id);
      else next.set(id, 1);
      return next;
    });
  };

  const changeOptionQuantity = (id: string, quantity: number) => {
    setSelectedOptions((current) => {
      const next = new Map(current);
      next.set(id, quantity);
      return next;
    });
  };

  const summary = useMemo(() => {
    const serviceLines = services
      .filter((item) => selectedServices.has(item.id))
      .map((item) => ({ ...item, quantity: 1, total: item.price }));
    const optionLines = options
      .filter((item) => selectedOptions.has(item.id))
      .map((item) => {
        const quantity = selectedOptions.get(item.id) ?? 1;
        return { ...item, quantity, total: item.price * quantity };
      });
    const servicesTotal = serviceLines.reduce(
      (total, item) => total + item.total,
      0,
    );
    const optionsTotal = optionLines.reduce(
      (total, item) => total + item.total,
      0,
    );

    return {
      serviceLines,
      optionLines,
      servicesTotal,
      optionsTotal,
      total: servicesTotal + optionsTotal,
    };
  }, [options, selectedOptions, selectedServices, services]);

  const hasSelection =
    summary.serviceLines.length + summary.optionLines.length > 0;

  const reset = () => {
    setSelectedServices(new Set());
    setSelectedOptions(new Map());
  };

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-3 pb-8 pt-16 sm:gap-6 sm:px-6 sm:pb-10">
      <header className="flex min-w-0 items-center gap-3 text-white">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-border">
          <CalculatorIcon className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Calculateur</h1>
          <p className="text-sm leading-snug text-white/70">
            Composez une prestation et obtenez son tarif instantanément.
          </p>
        </div>
      </header>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.55fr)] lg:items-start">
        <div className="grid min-w-0 gap-5 md:grid-cols-2">
          <section className="min-w-0 rounded-3xl bg-border p-4 shadow-sm sm:p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">Prestations</h2>
              <p className="text-sm text-white/60">
                Sélectionnez une ou plusieurs prestations.
              </p>
            </div>
            {services.length > 0 ? (
              <div className="flex flex-col gap-2">
                {services.map((item) => (
                  <SelectableItem
                    key={item.id}
                    item={item}
                    selected={selectedServices.has(item.id)}
                    onToggle={() => toggleService(item.id)}
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-white/8 p-5 text-center text-sm text-white/60">
                Aucune prestation active.
              </p>
            )}
          </section>

          <section className="min-w-0 rounded-3xl bg-border p-4 shadow-sm sm:p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-white">Options</h2>
              <p className="text-sm text-white/60">
                Ajustez la quantité si nécessaire.
              </p>
            </div>
            {options.length > 0 ? (
              <div className="flex flex-col gap-2">
                {options.map((item) => (
                  <OptionItem
                    key={item.id}
                    item={item}
                    selected={selectedOptions.has(item.id)}
                    quantity={selectedOptions.get(item.id) ?? 1}
                    onToggle={() => toggleOption(item.id)}
                    onQuantityChange={(quantity) =>
                      changeOptionQuantity(item.id, quantity)
                    }
                  />
                ))}
              </div>
            ) : (
              <p className="rounded-2xl bg-white/8 p-5 text-center text-sm text-white/60">
                Aucune option active.
              </p>
            )}
          </section>
        </div>

        <aside className="min-w-0 rounded-3xl bg-white p-5 text-text shadow-sm sm:p-6 lg:sticky lg:top-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ReceiptText className="size-5 shrink-0" />
              <h2 className="text-lg font-semibold">Récapitulatif</h2>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-text hover:text-text"
              onClick={reset}
              disabled={!hasSelection}
            >
              <RotateCcw />
              Effacer
            </Button>
          </div>

          {!hasSelection ? (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 px-4 text-center">
              <CalculatorIcon className="mb-3 size-7 text-text/45" />
              <p className="text-sm font-medium">Aucun élément sélectionné</p>
              <p className="mt-1 text-xs text-text/65">
                Le détail du tarif apparaîtra ici.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {summary.serviceLines.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text/60">
                    Prestations
                  </h3>
                  <ul className="space-y-2">
                    {summary.serviceLines.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 break-words">{item.name}</span>
                        <span className="shrink-0 font-medium">
                          {formatPrice(item.total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {summary.optionLines.length > 0 && (
                <div>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-text/60">
                    Options
                  </h3>
                  <ul className="space-y-2">
                    {summary.optionLines.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-3 text-sm"
                      >
                        <span className="min-w-0 break-words">
                          {item.name}
                          {item.quantity > 1 && (
                            <span className="ml-1 text-text/60">
                              × {item.quantity}
                            </span>
                          )}
                        </span>
                        <span className="shrink-0 font-medium">
                          {formatPrice(item.total)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-2 border-t border-border/30 pt-4 text-sm">
                <div className="flex justify-between gap-3 text-text/70">
                  <span>Prestations</span>
                  <span>{formatPrice(summary.servicesTotal)}</span>
                </div>
                <div className="flex justify-between gap-3 text-text/70">
                  <span>Options</span>
                  <span>{formatPrice(summary.optionsTotal)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 flex items-end justify-between gap-4 rounded-2xl bg-border px-4 py-4 text-white">
            <span className="text-sm font-medium">Total</span>
            <output className="text-2xl font-semibold" aria-live="polite">
              {formatPrice(summary.total)}
            </output>
          </div>
        </aside>
      </div>
    </main>
  );
}
