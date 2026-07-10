"use client";

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
  const prestation = useBookingStore((state) => state.prestation);
  const options = useBookingStore((state) => state.options);
  const optPrice = options.reduce((total, option)=>{
    return total + option.price
  }, 0)
  const totalPrice = (prestation?.price ?? 0) + optPrice;

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

          <div className="flex items-start justify-between gap-4 border-b border-white/20 pb-4">
            <span className="text-sm font-bold uppercase tracking-[0.18em] text-white/70">
              {t("prestation")}
            </span>
            <span className="max-w-[60%] text-right text-base font-bold sm:text-lg">
              {prestation?.name}
            </span>
          </div>

          {options.length > 0 && (
            <div className="border-b border-white/20 pb-4">
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

        <div className="flex items-center justify-between gap-4 bg-white px-6 py-5 text-border sm:px-8">
          <span className="text-sm font-bold uppercase tracking-[0.18em]">
            {t("price")}
          </span>
          <span className="text-2xl font-bold">{totalPrice} ₪</span>
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
      <button className="mt-7 text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">Suivant</button>
    </div>
  );
}
