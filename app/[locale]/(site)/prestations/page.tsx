'use client'

import { useBookingStore } from "@/store/booking-store"
import { useTranslations, useLocale } from "next-intl"
import Link from "next/link"

export default function Prestations() {

  const t = useTranslations('prestations')
  const locale = useLocale()
  const presta = useBookingStore((state)=>state.prestation)
  const setPresta = useBookingStore((state=>state.setPrestation))

  const prestations = [
    {name: t('presta_1'),price: 20},
    {name: t('presta_2'),price: 40},
    {name: t('presta_3'),price: 50},
    {name: t('presta_4'),price: 100},
    {name: t('presta_5'),price: 110},
    {name: t('presta_6'),price: 180},
    {name: t('presta_7'),price: 130},
]

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="font-third text-[50px] text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">{t('title')}</h1>
        <h3 className="font-second text-[50px] -translate-y-12">{t('subtitle')}</h3>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-9/10 -translate-y-5">
        {prestations.map((p)=>(
            <button onClick={()=>setPresta(p)} key={p.name} className={`text-sm text-text flex flex-col justify-center items-center rounded-full bg-white/70 w-full h-[50px] ${presta?.name === p.name ? "border-2 border-border" : ""}`}>
              <p>{p.name}</p> 
              <p className="">{p.price} ₪</p>
            </button>
        ))}
      </div>
        <Link href={'/options'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[40px] py-1">Suivant</Link>
    </div>
  )
}
