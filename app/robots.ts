import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noa-bensadon.art";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard/",
        "/*/sign-in",
        "/*/sign-up",
        "/*/forgot-password",
        "/*/appointments",
        "/*/confirmation",
        "/*/confirmed",
        "/*/options",
        "/*/prestations",
        "/*/profile",
        "/*/reservation",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
