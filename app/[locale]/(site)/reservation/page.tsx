"use client";

import { useBookingStore } from "@/store/booking-store";
import { useLocale, useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import Link from "next/link";

export default function Reservations() {
  const t = useTranslations("reservation");
  const locale = useLocale();
  const dateStore = useBookingStore((state) => state.date);
  const timeStore = useBookingStore((state) => state.time);
  const setDateStore = useBookingStore((state) => state.setDate);
  const setTimeStore = useBookingStore((state) => state.setTime);
  const selectedDate = dateStore ? new Date(dateStore) : undefined;

  const hours = ["9:00", "11:00", "13:00", "15:00", "17:00", "19:00"]

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
        dir="ltr"
        mode="single"
        showOutsideDays={false}
        startMonth={startOfMonth(new Date())}
        endMonth={endOfMonth(addMonths(new Date(), 1))}
        selected={selectedDate}
        onSelect={(date) => {
          if (!date) return
          setDateStore(date.toISOString())
        }}
        disabled={[
          {before: new Date(), after: endOfMonth(addMonths(new Date(), 1))},
          {dayOfWeek: [5, 6]}
          ]}
        className="
          rounded-3xl bg-border p-4 text-white font-bold
          [--cell-size:2.5rem]
          [&_.rdp-day_button]:text-white
          [&_.rdp-day_button[data-selected-single=true]]:bg-white
          [&_.rdp-day_button[data-selected-single=true]]:text-border
          [&_.rdp-day_button[data-today=true]]:bworder
          [&_.rdp-day_button[data-today=true]]:border-text
        "
      />
      <div className="grid grid-cols-2 grid-rows-3 gap-2 bg-border w-4/5 mt-4 rounded-xl p-4 mb-5">
          {hours.map((h)=>(
            <button onClick={()=>setTimeStore(h)} className={`border-none rounded-full p-2 ${timeStore === h ? 'bg-background text-white' : "bg-white text-border"}`} key={h}>{h}</button>
          ))}
      </div>
      <Link href={'/confirmation'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">Suivant</Link>
    </div>
  );
}
