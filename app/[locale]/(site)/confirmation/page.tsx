"use client";

import Link from "next/link";
import { useBookingStore } from "@/store/booking-store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { format } from "date-fns";

export default function Confirmation() {
  const t = useTranslations("confirmation");
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const time = useBookingStore((state) => state.time);
  const date = useBookingStore((state) => state.date);
  const newDate = date ? format(new Date(date), "dd.MM.yyyy") : "";
  const prestations = useBookingStore((state) => state.prestations);
  const options = useBookingStore((state) => state.options);


  return (
    <div className="flex min-h-[calc(100vh-5rem)] w-full flex-col items-center overflow-y-auto px-4 pt-6 pb-10 text-white">
      <h1 className="mt-4 mb-8 text-center font-third text-[48px] leading-none text-shadow-[4px_6px_8px_rgba(0,0,0,0.35)] sm:text-[58px]">
        {t("title")}
      </h1>

      <section className="w-full max-w-xl rounded-3xl border border-white/25 bg-border shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
        <div className="space-y-4 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
              {t("date")}
            </span>
            <span className="text-right text-base font-bold sm:text-lg">
              {newDate}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 border-b border-white/20 pb-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
              {t("hour")}
            </span>
            <span className="text-right text-base font-bold sm:text-lg">
              {time}
            </span>
          </div>

         {prestations.length > 0 && (
            <div className="border-b border-white/20 pb-4">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                {t("prestations")}
              </p>

              <div className="flex flex-wrap gap-2">
                {prestations.map((presta) => (
                  <span
                    key={presta.name}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-bold"
                  >
                    {presta.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {options.length > 0 && (
            <div className="pb-4">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-white/70">
                {t("options")}
              </p>

              <div className="flex flex-wrap gap-2">
                {options.map((option) => (
                  <span
                    key={option.name}
                    className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-bold"
                  >
                    {option.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <label className="mt-6 flex w-full max-w-xl cursor-pointer items-start gap-3 rounded-2xl border border-white/25 bg-border p-4 text-white shadow-[0_10px_30px_rgba(0,0,0,0.1)]">
        <input
          type="checkbox"
          checked={conditionsAccepted}
          onChange={(event) => setConditionsAccepted(event.target.checked)}
          className="mt-1 size-5 shrink-0 cursor-pointer accent-white"
        />

        <span className="space-y-1">
          <span className="block font-bold">{t("conditions_btn")}</span>
          <span className="block text-sm leading-6 text-white/75">
            {t("conditions")}
          </span>
        </span>
      </label>
      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        <Link href={'/reservation'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">{t('previous')}</Link>
        <Link href={'/rdv'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">{t('next')}</Link>
      </div>
    </div>
  );
}
