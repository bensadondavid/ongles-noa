'use client'

import { useBookingStore } from "@/store/booking-store"
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"


export default function Options() {

  const t = useTranslations('options')
  const locale = useLocale()
  const opts = useBookingStore((state)=>state.options)
  const toggleOption = useBookingStore((state)=>state.toggleOption)

  const options = [
    {name: t('option_1'), price: 10},
    {name: t('option_2'),price: 10},
    {name: t('option_3'),price: 20},
    {name: t('option_4'),price: 20},
    {name: t('option_5'),price: 20},
    {name: t('option_6'),price: 10},
    {name: t('option_7'),price: 10},
    {name: t('option_8'),price: 30},
]

  return (
    <div className="flex flex-col items-center pt-10 pb-4">
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="font-third text-[50px] text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">{t('title')}</h1>
        <h3 className="font-second text-[50px] -translate-y-12">{t('subtitle')}</h3>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-9/10 -translate-y-5">
        {options.map((o)=>{
          const isSelected = opts.some((opt) => opt.name === o.name)
          return(
            <button onClick={()=>toggleOption(o)} key={o.name} className={`text-sm text-text flex flex-col justify-center items-center rounded-full bg-white/70 w-full h-[50px] ${isSelected ? "border-2 border-border" : ""}`}>
              <p>{o.name}</p> 
              <p className="">{o.price} ₪</p>
            </button>
            )
        })}
      </div>
        <Link href={'/reservation'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">{t('next')}</Link>
    </div>
  )
}
