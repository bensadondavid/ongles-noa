import { useTranslations } from "next-intl"


export default function Prestations() {

  const t = useTranslations('prestations')

  const prestations = [
    {name: t('presta_1'), price: 50},
    {name: t('presta_2'),price: 20},
    {name: t('presta_3'),price: 40},
    {name: t('presta_4'),price: 90},
    {name: t('presta_5'),price: 90},
    {name: t('presta_6'),price: 180},
    {name: t('presta_7'),price: 130},
]

  return (
    <div className="flex flex-col items-center pt-10">
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="font-third text-[50px] text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">{t('title')}</h1>
        <h3 className="font-second text-[50px] -translate-y-12">{t('subtitle')}</h3>
      </div>
        {prestations.map((p)=>(
            <button key={p.name} className="border-none rounded-full bg-[255, 255, 255, 0.7]">
              <p>{p.name}</p> 
              <p>{p.price} ₪</p>
            </button>
        ))}
        <button>Suivant</button>
    </div>
  )
}
