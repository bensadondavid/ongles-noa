import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noa-bensadon.art";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/mentions-legales", "/cgv"];

  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, `${baseUrl}/${locale}${path}`]),
    );

    return routing.locales.map((locale) => ({
      url: `${baseUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority:
        path === "" ? (locale === routing.defaultLocale ? 1 : 0.8) : 0.3,
      alternates: { languages },
    }));
  });
}
