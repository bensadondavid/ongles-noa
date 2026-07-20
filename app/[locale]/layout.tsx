import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { blackgold, moontime, abramo } from "@/lib/fonts/fonts";
import { Nixie_One } from "next/font/google";
import { Toaster } from "sonner";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export const nixieOne = Nixie_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nixie-one",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "metadata",
  });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const title = "Noa Bensadon";
  const description = t("description");

  return {
    metadataBase: new URL(siteUrl),

    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        he: "/he",
      },
    },

    openGraph: {
      type: "website",
      locale: locale === "he" ? "he_IL" : "fr_FR",
      url: `/${locale}`,
      siteName: title,
      title,
      description,
      images: [
        {
          url: "/logo-noa-og.png",
          width: 1200,
          height: 630,
          alt: "Noa Bensadon",
        },
      ],
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    icons: {
      icon: "/logo-noa-fav.png",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const messages = await getMessages();
  const { locale } = await params;

  return (
    <html
      lang={locale}
      dir={locale === "he" ? "rtl" : "ltr"}
      className={`
        ${blackgold.variable}
        ${moontime.variable}
        ${nixieOne.variable}
        ${abramo.variable}
        h-full
        antialiased
      `}
    >
      <body className="min-h-full flex flex-col font-primary">
        <NextIntlClientProvider messages={messages}>
          <SidebarProvider className="min-h-0 h-screen">
            <AppSidebar />

            <SidebarInset>
              <SidebarTrigger className="absolute top-4 left-4 z-20" />

              {children}
            </SidebarInset>
          </SidebarProvider>

          <Toaster
            richColors
            position="top-right"
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}