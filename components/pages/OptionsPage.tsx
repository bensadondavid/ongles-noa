"use client";

import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { useBookingStore } from "@/store/booking-store";
import { getOptionTranslationKey } from "@/lib/services/catalog";

type Option = {
  id: string;
  name: string;
  price: number;
};

type OptionsPageProps = {
  options: Option[];
};

export default function OptionsPage({ options }: OptionsPageProps) {
  const t = useTranslations("options");
  const selectedOptions = useBookingStore((state) => state.options);
  const toggleOption = useBookingStore((state) => state.toggleOption);

  const getLocalizedName = (option: Option) => {
    const translationKey = getOptionTranslationKey(option.name);

    return translationKey ? t(translationKey) : option.name;
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
        {options.length === 0 ? (
          <p className="rounded-2xl bg-white/70 px-4 py-5 text-center text-sm text-text">
            {t("empty")}
          </p>
        ) : (
          options.map((option) => {
            const localizedName = getLocalizedName(option);
            const isSelected = selectedOptions.some(
              (selected) => selected.name === localizedName,
            );

            return (
              <button
                type="button"
                onClick={() =>
                  toggleOption({ name: localizedName, price: option.price })
                }
                key={option.id}
                className={`flex min-h-14 w-full min-w-0 flex-col items-center justify-center rounded-2xl bg-white/70 px-4 py-2 text-center text-sm leading-snug text-text transition-colors sm:rounded-full sm:text-base ${isSelected ? "border-2 border-border" : "border-2 border-transparent"}`}
              >
                <span className="break-words">{localizedName}</span>
                <span className="whitespace-nowrap">{option.price} ₪</span>
              </button>
            );
          })
        )}
      </div>

      <div className="grid w-full max-w-xs grid-cols-2 gap-2">
        <Link
          href="/prestations"
          className="flex h-12 min-w-0 items-center justify-center rounded-full bg-white/70 px-2 text-center font-second text-2xl text-text sm:text-3xl"
        >
          {t("previous")}
        </Link>
        <Link
          href="/reservation"
          className="flex h-12 min-w-0 items-center justify-center rounded-full bg-white/70 px-2 text-center font-second text-2xl text-text sm:text-3xl"
        >
          {t("next")}
        </Link>
      </div>
    </div>
  );
}
