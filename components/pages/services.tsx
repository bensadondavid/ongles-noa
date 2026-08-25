"use client";

import { useState, type FormEvent } from "react";
import { Edit3, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type ServiceItem = {
  id: string;
  name: string;
  price: number;
  isActive: boolean;
};

type ItemKind = "service" | "option";
type EditableItem = ServiceItem & { kind: ItemKind };

type ServicesProps = {
  services: ServiceItem[];
  options: ServiceItem[];
};

type ServiceListProps = {
  title: string;
  description: string;
  items: ServiceItem[];
  kind: ItemKind;
  onEdit: (item: EditableItem) => void;
};

function ServiceList({
  title,
  description,
  items,
  kind,
  onEdit,
}: ServiceListProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl bg-border p-4 text-white shadow-sm sm:rounded-3xl sm:p-5">
      <div className="mb-4 min-w-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-white/65">{description}</p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-white/10 px-3 py-5 text-center text-sm text-white/60">
          Aucun élément.
        </p>
      ) : (
        <ul className="flex min-w-0 flex-col gap-2">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex min-w-0 items-center justify-between gap-2 rounded-xl px-3 py-3 sm:gap-4 sm:px-4 ${
                item.isActive ? "bg-white/10" : "bg-black/10 text-white/55"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <p className="min-w-0 break-words text-sm font-medium leading-snug sm:text-base">
                    {item.name}
                  </p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      item.isActive
                        ? "bg-emerald-500/20 text-emerald-200"
                        : "bg-white/10 text-white/55"
                    }`}
                  >
                    {item.isActive ? "Actif" : "Inactif"}
                  </span>
                </div>
                <p className="mt-0.5 whitespace-nowrap text-sm text-white/65">
                  {item.price} ₪
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-white hover:bg-white/15 hover:text-white"
                onClick={() => onEdit({ ...item, kind })}
                aria-label={`Modifier ${item.name}`}
              >
                <Edit3 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function Services({ services, options }: ServicesProps) {
  const [serviceItems, setServiceItems] = useState(services);
  const [optionItems, setOptionItems] = useState(options);
  const [selectedItem, setSelectedItem] = useState<EditableItem | null>(null);
  const [price, setPrice] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const openEditor = (item: EditableItem) => {
    setSelectedItem(item);
    setPrice(String(item.price));
    setIsActive(item.isActive);
  };

  const closeEditor = () => {
    if (saving) return;
    setSelectedItem(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedItem) return;

    const numericPrice = Number(price);
    if (!Number.isInteger(numericPrice) || numericPrice < 0) {
      toast.error("Le prix doit être un nombre entier positif ou nul");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/dashboard/services/${selectedItem.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: selectedItem.kind,
            price: numericPrice,
            isActive,
          }),
        },
      );
      const data = (await response.json()) as {
        item?: ServiceItem;
        error?: string;
      };

      if (!response.ok || !data.item) {
        toast.error(data.error ?? "Impossible d’enregistrer les modifications");
        return;
      }

      const savedItem = data.item;
      const updateItem = (items: ServiceItem[]) =>
        items.map((item) => (item.id === savedItem.id ? savedItem : item));

      if (selectedItem.kind === "service") {
        setServiceItems(updateItem);
      } else {
        setOptionItems(updateItem);
      }

      setSelectedItem(null);
      toast.success("Modifications enregistrées");
    } catch {
      toast.error("Impossible d’enregistrer les modifications");
    } finally {
      setSaving(false);
    }
  };

  const activeServiceCount = serviceItems.filter(
    (item) => item.isActive,
  ).length;
  const activeOptionCount = optionItems.filter((item) => item.isActive).length;

  return (
    <main className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-5 overflow-x-hidden px-3 pb-8 pt-16 sm:gap-6 sm:px-6 sm:pb-10">
      <header className="flex min-w-0 items-center gap-3 text-white">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-border">
          <Sparkles className="size-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm leading-snug text-white/70">
            Modifiez les tarifs et la disponibilité.
          </p>
        </div>
      </header>

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        <ServiceList
          title="Prestations"
          description={`${activeServiceCount} active${activeServiceCount > 1 ? "s" : ""} sur ${serviceItems.length}`}
          items={serviceItems}
          kind="service"
          onEdit={openEditor}
        />
        <ServiceList
          title="Options"
          description={`${activeOptionCount} active${activeOptionCount > 1 ? "s" : ""} sur ${optionItems.length}`}
          items={optionItems}
          kind="option"
          onEdit={openEditor}
        />
      </div>

      <Dialog
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
      >
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="grid min-w-0 gap-5">
            <DialogHeader>
              <DialogTitle>
                Modifier{" "}
                {selectedItem?.kind === "service"
                  ? "la prestation"
                  : "l’option"}
              </DialogTitle>
              <DialogDescription className="break-words">
                {selectedItem?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="grid min-w-0 gap-4">
              <div className="grid min-w-0 gap-2">
                <Label htmlFor="service-price">Prix en shekels</Label>
                <Input
                  id="service-price"
                  className="min-w-0"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-3">
                <div className="min-w-0">
                  <Label htmlFor="service-active">Visible sur le site</Label>
                  <p className="text-xs text-muted-foreground">
                    Les éléments inactifs ne sont pas proposés aux clientes.
                  </p>
                </div>
                <Switch
                  id="service-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  disabled={saving}
                  aria-label="Rendre cet élément visible sur le site"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={saving}
                >
                  Annuler
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={saving}
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
