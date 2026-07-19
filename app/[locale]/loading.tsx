import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";

export default function Loading() {
  const t = useTranslations("loading");

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <Loader2
        className="h-8 w-8 animate-spin text-[#7d6258]"
        strokeWidth={2.2}
      />
      <p className="text-sm text-[#6f574e] sm:text-base">{t("message")}</p>
    </main>
  );
}
