import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { blackgold, moontime, abramo } from "@/lib/fonts/fonts";
import { Nixie_One } from "next/font/google";
import { Toaster } from "sonner";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getTranslations } from "next-intl/server";


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
    return {
      title: "Noa Bensadon",
      description: t("description"),
    };
  }

export const nixieOne = Nixie_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nixie-one",
  display: "swap",
});

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
      className={`${blackgold.variable} ${moontime.variable} ${nixieOne.variable} ${abramo.variable} h-full antialiased`}
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
          <Toaster richColors position="top-right" />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
