"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Link } from "@/i18n/navigation";
import { useBookingStore } from "@/store/booking-store";

export default function Home() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("home");
  const changeLocale = (locale: "fr" | "he") => {
    router.replace(pathname, { locale }); // next-intl injecte la locale lui-même
  };
  const session = authClient.useSession();
  const user = session.data?.user;

  const setPrestations = useBookingStore((state)=>state.setPrestations)
  const setOptions = useBookingStore((state=>state.setOptions))
  const setDate = useBookingStore((state)=>state.setDate)
  const setTime = useBookingStore((state)=>state.setTime)

  const resetStore = ()=>{
    setTime(null)
    setDate(null)
    setOptions([])
    setPrestations([])
  }

  return (
    <div className="h-screen w-full bg-transparent flex flex-col justify-around items-center relative pb-20 overflow-hidden">
      <Image
        src={"/fil-1.png"}
        width={200}
        height={200}
        alt="img-1"
        className="absolute right-0 top-0 md:hidden"
      />
      <Image
        src={"/fil-2.png"}
        width={180}
        height={200}
        alt="img-1"
        className="absolute -left-8 bottom-0 z-10 md:hidden"
      />
      <Image
        src={"/fil-3.png"}
        width={180}
        height={200}
        alt="img-1"
        className="absolute right-0 bottom-0 z-10 md:hidden"
      />
      <div dir="ltr" className="flex flex-row h-fit pt-5">
        <button
          onClick={() => {
            changeLocale("fr");
            resetStore();
          }}
          className="bg-white border-4 border-r-2 px-2 py-1 rounded-l-full text-xl z-10"
        >
          🇫🇷
        </button>
        <button
          onClick={() => {
            changeLocale("he");
            resetStore();
          }}
          className="bg-white border-4 px-2 py-1 border-l-2 rounded-r-full text-xl z-10"
        >
          🇮🇱
        </button>
      </div>
      <div className="flex flex-col items-center">
        <p className="font-third text-[90px] text-white translate-y-20">Noa</p>
        <p className="font-fourth text-[150px] -translate-x-4 text-white">Bensadon</p>
      </div>
      {user ? (
        <Link href="/prestations" className="z-10 flex text-center items-center justify-center bg-white w-[180px] h-[60px] border-4 rounded-full font-third text-border capitalize whitespace-pre-line">
          {t("rdv")}
        </Link>
      ) : (
        <div className="flex flex-col gap-1">
          <Link href="/sign-in" className="z-10 flex items-center justify-center bg-white w-[180px] h-[40px] border-4 rounded-full font-third text-border capitalize whitespace-pre-line">
            {t("sign-in")}
          </Link>

          <Link href="/sign-up" className="z-10 flex items-center justify-center bg-white w-[180px] h-[40px] border-4 rounded-full font-third text-border capitalize whitespace-pre-line">
            {t("sign-up")}
          </Link>
        </div>
      )}
    </div>
  );
}
