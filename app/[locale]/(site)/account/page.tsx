"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation" // ← les helpers next-intl, pas next/navigation

export default function Account() {

  const pathname = usePathname() 
  const router = useRouter()
  const t = useTranslations('account.home')
   const changeLocale = (locale: "fr" | "he") => {
    router.replace(pathname, { locale }) // next-intl injecte la locale lui-même
  }

  return (
    <div className="h-screen w-full bg-transparent flex flex-col justify-around items-center relative pb-20 overflow-hidden">
      <Image src={'/fil-1.png'} width={200} height={200} alt="img-1" className="absolute right-0 top-0" />
      <Image src={'/fil-2.png'} width={180} height={200} alt="img-1" className="absolute -left-4 bottom-0" />
      <Image src={'/fil-3.png'} width={180} height={200} alt="img-1" className="absolute right-0 bottom-0" />
      <div dir="ltr" className="flex flex-row h-fit pt-5">
        <button onClick={()=>{changeLocale('fr')}} className="bg-white border-4 border-r-2 px-2 py-1 rounded-l-full text-xl z-100">🇫🇷</button>
        <button onClick={()=>{changeLocale('he')}} className="bg-white border-4 px-2 py-1 border-l-2 rounded-r-full text-xl z-100">🇮🇱</button>
      </div>
      <div className="flex flex-col items-center">
        <p className="font-third text-[90px] text-white translate-y-25">Noa</p>
        <p className="font-second text-[150px] text-white">Bensadon</p>
      </div>
      <button className="bg-white w-[180px] h-[60px] border-4 rounded-full font-third text-border capitalize whitespace-pre-line">{t('rdv')}</button>
    </div>
  )
}
