"use client";

import { useBookingStore } from "@/store/booking-store";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import { addMonths, endOfMonth, startOfMonth } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { useEffect } from "react";
import { useState } from "react";

export default function Reservations() {
  const t = useTranslations("reservation");
  const dateStore = useBookingStore((state) => state.date);
  const timeStore = useBookingStore((state) => state.time);
  const setDateStore = useBookingStore((state) => state.setDate);
  const setTimeStore = useBookingStore((state) => state.setTime);
  const prestation = useBookingStore((state) => state.prestations);
  const selectedDate = dateStore ? new Date(dateStore) : undefined;
  const prestaLength = prestation.length

  const [hours, setHours] = useState<string[]>([])

  useEffect(() => {
  if (!dateStore) return

  const getAvailableHours = async () => {
    const response = await fetch("/api/search-time", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dateStore, prestaLength }),
    })
    if (!response.ok) {
      return toast.error("error")
    }
    const data = await response.json()
    setHours(data.availableHours)  }
    getAvailableHours()
}, [dateStore, prestaLength])


  const verifyResa = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!dateStore) {
      e.preventDefault()
      return toast.error(t("date"), {
        style: {
          background: "#fff",
          color: "#000",
          border: "2px solid #C9A96E",
        },
      })
    }
    if (!timeStore) {
      e.preventDefault()
      return toast.error(t("time"), {
        style: {
          background: "#fff",
          color: "#000",
          border: "2px solid #C9A96E",
        },
      })
    }
  }

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
          setTimeStore("")
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
          [&_.rdp-day_button[data-today=true]]:border
          [&_.rdp-day_button[data-today=true]]:border-text
        "
      />
      <div className="grid grid-cols-2 grid-rows-3 gap-2 bg-border w-4/5 mt-4 rounded-xl p-4 mb-5">
          {hours.map((h)=>(
            <button onClick={()=>setTimeStore(h)} className={`border-none rounded-full p-2 ${timeStore === h ? 'bg-background text-white' : "bg-white text-border"}`} key={h}>{h}</button>
          ))}
      </div>
      <div className="flex flex-row gap-2 items-center justify-center">
        <Link href={'/options'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">{t('previous')}</Link>
        <Link onClick={verifyResa} href={'/confirmation'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">{t('next')}</Link>
      </div>
    </div>
  );
}
