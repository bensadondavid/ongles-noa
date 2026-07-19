'use client'

import { useBookingStore } from "@/store/booking-store"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { toast } from "sonner"

export default function PrestationsPage() {

  const t = useTranslations('prestations')
  const togglePrestation = useBookingStore((state)=>state.togglePrestation)
  const selectedPrestations = useBookingStore((state) => state.prestations)
  
  const prestations = [
    {name: t('presta_1'),price: 20},
    {name: t('presta_2'),price: 40},
    {name: t('presta_3'),price: 50},
    {name: t('presta_4'),price: 100},
    {name: t('presta_5'),price: 110},
    {name: t('presta_6'),price: 180},
    {name: t('presta_7'),price: 130},
  ]

  const verifyLengthPresta = (e: React.MouseEvent<HTMLAnchorElement>)=>{
    if(selectedPrestations.length === 0){
      e.preventDefault()
      return toast.error(t('select'), {style: { background: "#fff", color: "#000", border: "2px solid #C9A96E",}})
      }
    }


  return (
    <div className="flex flex-col items-center pt-10">
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="font-third text-[50px] text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">{t('title')}</h1>
        <h3 className="font-second text-[50px] -translate-y-12">{t('subtitle')}</h3>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 w-9/10 -translate-y-5">
        {prestations.map((p)=>{
          const isSelected = selectedPrestations.some((selected) => selected.name === p.name)
          return(
            <button onClick={()=>togglePrestation(p)} key={p.name} className={`text-md text-text flex flex-col justify-center items-center rounded-full bg-white/70 w-full h-[50px] ${isSelected ? "border-2 border-border" : ""}`}>
              <p>{p.name}</p> 
              <p className="">{p.price} ₪</p>
            </button>
            )
          })}
      <p className="text-sm text-white font-bold text-center">{t('depose')}</p>
      </div>
        <Link onClick={verifyLengthPresta} href={'/options'} className="text-center font-second text-4xl text-text border-none rounded-full bg-white/70 w-[140px] h-[45px]"><span className="inline-block translate-y-1">{t('next')}</span></Link>
    </div>
  )
}
