"use client";

import Link from "next/link";
import { useBookingStore } from "@/store/booking-store";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

export default function Confirmation() {
  const t = useTranslations("confirmation");
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const time = useBookingStore((state) => state.time);
  const date = useBookingStore((state) => state.date);
  const newDate = date ? format(new Date(date), "dd.MM.yyyy") : "";
  const prestations = useBookingStore((state) => state.prestations);
  const options = useBookingStore((state) => state.options);
  const message = useBookingStore((state) => state.message);
  const setMessage = useBookingStore((state) => state.setMessage);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, time, prestations, options, message }),
      });
      if (!response.ok) {
        return toast.error(t("error"));
      }
      router.push("/confirmed");
    } catch (error) {
      console.log(error);
      return toast.error(t("error"));
    }
  };

  return (
    <div className="overflow-hidden flex min-h-[calc(100vh-5rem)] w-full flex-col items-center overflow-y-auto px-4 pt-8 pb-10 text-white">
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

      <div className="mt-4 w-full max-w-xl rounded-3xl border border-white/25 bg-border p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <label
            htmlFor="message"
            className="text-sm font-bold uppercase tracking-[0.18em] text-white/70"
          >
            {t("message")}
          </label>

          <span className="text-xs text-white/50">
            {message?.length ?? 0}/300
          </span>
        </div>

        <textarea
          id="message"
          name="message"
          maxLength={300}
          rows={4}
          value={message ?? ""}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full resize-none rounded-2xl border border-white/20 bg-white/95 px-4 py-3 font-primary font-bold text-sm leading-6 text-border outline-none transition placeholder:text-border/40 focus:border-white focus:ring-2 focus:ring-white/25"
        />
      </div>

      <label className="mt-5 flex w-full max-w-xl cursor-pointer items-start gap-3 px-2">
        <input
          type="checkbox"
          checked={conditionsAccepted}
          onChange={(event) => setConditionsAccepted(event.target.checked)}
          className="mt-1 size-5 shrink-0 cursor-pointer accent-[#6f574e]"
        />

        <span className="text-sm leading-6 text-white">
          <span className="font-bold">{t("conditions_btn")}</span>{" "}
          {t("conditions")}
        </span>
      </label>
      <div className="flex flex-row gap-2 items-center justify-center mt-5">
        <Link
          href={"/reservation"}
          className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[50px] py-1"
        >
          <span className="inline-block translate-y-2">{t("previous")}</span>
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!conditionsAccepted}
          className={`text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[50px] py-1 ${conditionsAccepted ? "bg-white/70 cursor-pointer" : "bg-white/30 cursor-not-allowed opacity-50"} `}
        >
          <span className="inline-block translate-y-2">{t("next")}</span>
        </button>
      </div>
    </div>
  );
}
