"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Link } from "@/i18n/navigation";
import { useBookingStore } from "@/store/booking-store";
import { getPrestationTranslationKey } from "@/lib/services/catalog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Prestation = {
  id: string;
  name: string;
  price: number;
};

type PrestationsPageProps = {
  prestations: Prestation[];
};

export default function PrestationsPage({ prestations }: PrestationsPageProps) {
  const t = useTranslations("prestations");
  const togglePrestation = useBookingStore((state) => state.togglePrestation);
  const selectedPrestations = useBookingStore((state) => state.prestations);
  const [deposeGelDialogOpen, setDeposeGelDialogOpen] = useState(false);

  const deposeGel = prestations.find(
    (prestation) => prestation.name === "Dépose",
  );

  const getLocalizedName = (prestation: Prestation) => {
    const translationKey = getPrestationTranslationKey(prestation.name);

    return translationKey ? t(translationKey) : prestation.name;
  };

  const handleTogglePrestation = (prestation: Prestation) => {
    const localizedPrestation = {
      name: getLocalizedName(prestation),
      price: prestation.price,
    };
    const isSelected = selectedPrestations.some(
      (selected) => selected.name === localizedPrestation.name,
    );

    if (prestation.id === deposeGel?.id && !isSelected) {
      setDeposeGelDialogOpen(true);
      return;
    }

    togglePrestation(localizedPrestation);
  };

  const verifyLengthPresta = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (selectedPrestations.length > 0) return;

    event.preventDefault();
    toast.error(t("select"), {
      style: {
        background: "#fff",
        color: "#000",
        border: "2px solid #C9A96E",
      },
    });
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-center overflow-x-hidden px-3 pb-6 pt-8 sm:px-6 sm:pt-10">
      <div className="flex flex-col items-center justify-center text-white">
        <h1 className="font-third text-4xl text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)] sm:text-[50px]">
          {t("title")}
        </h1>
        <h3 className="-translate-y-8 font-second text-4xl sm:-translate-y-12 sm:text-[50px]">
          {t("subtitle")}
        </h3>
      </div>

      <div className="flex w-full max-w-xl -translate-y-3 flex-col items-center justify-center gap-2 sm:-translate-y-5">
        {prestations.length === 0 ? (
          <p className="rounded-2xl bg-white/70 px-4 py-5 text-center text-sm text-text">
            {t("empty")}
          </p>
        ) : (
          prestations.map((prestation) => {
            const localizedName = getLocalizedName(prestation);
            const isSelected = selectedPrestations.some(
              (selected) => selected.name === localizedName,
            );

            return (
              <button
                type="button"
                onClick={() => handleTogglePrestation(prestation)}
                key={prestation.id}
                className={`flex min-h-14 w-full min-w-0 flex-col items-center justify-center rounded-2xl bg-white/70 px-4 py-2 text-center text-sm leading-snug text-text transition-colors sm:rounded-full sm:text-base ${isSelected ? "border-2 border-border" : "border-2 border-transparent"}`}
              >
                <span className="break-words">{localizedName}</span>
                <span className="whitespace-nowrap">{prestation.price} ₪</span>
              </button>
            );
          })
        )}

        <p className="px-2 text-center text-sm font-bold text-white">
          {t("depose")}
        </p>
      </div>

      <Link
        onClick={verifyLengthPresta}
        href="/options"
        className="flex h-12 w-36 items-center justify-center rounded-full bg-white/70 text-center font-second text-3xl text-text sm:text-4xl"
      >
        {t("next")}
      </Link>

      <AlertDialog
        open={deposeGelDialogOpen}
        onOpenChange={setDeposeGelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("depose_confirm_title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("depose_confirm_description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("depose_confirm_cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deposeGel &&
                togglePrestation({
                  name: getLocalizedName(deposeGel),
                  price: deposeGel.price,
                })
              }
            >
              {t("depose_confirm_ok")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
