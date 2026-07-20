import { Link } from "@/i18n/navigation";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default  function ConfirmedPage() {
  const t = useTranslations("confirmed");

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-3xl border border-[#cdbbb2]/50 bg-accent p-8 text-center shadow-[0_18px_45px_rgba(90,65,55,0.12)] backdrop-blur-md sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#b89f93]/40 bg-[#dfcec6]/70">
          <Check
            className="h-8 w-8 text-[#6f574e]"
            strokeWidth={2.2}
          />
        </div>

        <h1 className="mt-6 font-third text-4xl text-border sm:text-5xl">
          {t("title")}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#6f574e] sm:text-base">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/appointments"
            className="rounded-full bg-[#7d6258] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6b5148]"
          >
            {t("appointments")}
          </Link>

          <Link
            href="/"
            className="rounded-full border border-[#9f857a]/40 bg-white/50 px-6 py-3 text-sm font-medium text-[#5f4941] transition hover:bg-white/75"
          >
            {t("home")}
          </Link>
        </div>
      </div>
    </main>
  );
}