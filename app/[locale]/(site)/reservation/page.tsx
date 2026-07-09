"use client";

import { useBookingStore } from "@/store/booking-store";
import { useLocale, useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";

export default function Reservations() {
  const t = useTranslations("reservation");
  const locale = useLocale();
  const dateStore = useBookingStore((state) => state.date);
  const timeStore = useBookingStore((state) => state.time);
  const setDateStore = useBookingStore((state) => state.setDate);
  const setTimeStore = useBookingStore((state) => state.setTime);
  const selectedDate = dateStore ? new Date(dateStore) : undefined;

  return (
    <div className="flex flex-col items-center pt-10 pb-4">
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="font-third text-[50px] text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">
          {t("title")}
        </h1>
        <h3 className="font-second text-[50px] -translate-y-12">
          {t("subtitle")}
        </h3>
      </div>
     <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => {
          if (!date) return
          setDateStore(date.toISOString())
        }}
        className="
          rounded-3xl bg-white/70 p-4
          [--cell-size:2.5rem]
          [&_.rdp-day_button]:rounded-full
          [&_.rdp-day_button]:text-text
          [&_.rdp-day_button[data-selected-single=true]]:bg-border
          [&_.rdp-day_button[data-selected-single=true]]:text-white
          [&_.rdp-day_button[data-today=true]]:border
          [&_.rdp-day_button[data-today=true]]:border-text
        "
      />
    </div>
  );
}
