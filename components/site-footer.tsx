"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("sidebar");

  return (
    <footer className="mt-auto shrink-0 border-t border-white/25 bg-black/5 px-4 py-3">
      <nav
        aria-label={t("legalNavigation")}
        className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-foreground/65"
      >
        <Link
          href="/mentions-legales"
          className="underline-offset-4 hover:underline"
        >
          {t("legalNotice")}
        </Link>
        <Link href="/cgv" className="underline-offset-4 hover:underline">
          {t("terms")}
        </Link>
      </nav>
    </footer>
  );
}
