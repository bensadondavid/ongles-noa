"use client";

import { MapPin, Phone, Mail, Navigation, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";

const CONTACT = {
  addressQuery: "Kadish Luz 1, Jerusalem",
  phone: "0584808716",
  email: "amouyalnoa25@gmail.com",
  instagram: "https://www.instagram.com/noabensadon/",
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const encodedAddress = encodeURIComponent(CONTACT.addressQuery);

  const rows = [
    {
      icon: MapPin,
      label: t("address"),
      value: t("addressValue"),
      href: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
      external: true,
    },
    {
      icon: Phone,
      label: t("phone"),
      value: "058-480-8716",
      href: `tel:${CONTACT.phone}`,
      external: false,
    },
    {
      icon: Mail,
      label: t("email"),
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
      external: false,
    },
  ];

  return (
    <div className="w-full px-4 py-6">
      <h1 className="p-3 text-center font-third text-[50px] text-white text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">
        {t("title")}
      </h1>

      <div className="mx-auto mt-6 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-white/60 bg-black/30 p-6 shadow-lg backdrop-blur-sm sm:p-8">
        {rows.map(({ icon: Icon, label, value, href, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/10"
          >
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors group-hover:bg-white/25">
              <Icon className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm text-white/60">{label}</span>
              <span className="text-lg font-medium text-white">{value}</span>
            </span>
          </a>
        ))}

        <div className="mt-1 flex gap-3 px-3">
          <a
            href={`https://www.waze.com/ul?q=Kadish+Luz+1%2C+Jerusalem%2C+Israel&navigate=yes`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 py-2.5 font-medium text-white transition-colors hover:bg-white/20"
          >
            <Navigation className="size-4" />
            Waze
          </a>
          <a
            href={`moovit://directions?dest_name=Kadish%20Luz%201%2C%20Jerusalem%2C%20Israel`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 py-2.5 font-medium text-white transition-colors hover:bg-white/20"
          >
            <Navigation className="size-4" />
            Moovit
          </a>
        </div>

        <div className="my-2 h-px bg-white/20" />

        <a
          href={CONTACT.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/10"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-colors group-hover:bg-white/25">
            <InstagramIcon className="size-5" />
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-sm text-white/60">{t("instagram")}</span>
            <span className="text-lg font-medium text-white">@noabensadon</span>
          </span>
          <ExternalLink className="size-4 shrink-0 text-white/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80" />
        </a>
      </div>
    </div>
  );
}
