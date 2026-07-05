import type { Metadata } from "next";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import { getMessages } from "next-intl/server";
import { blackgold, moontime } from "@/lib/fonts/fonts";
import { Nixie_One } from "next/font/google"

export const metadata: Metadata = {
  title: "Noa Bensadon",
  description: "",
};



export const nixieOne = Nixie_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nixie-one",
  display: "swap"
})

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>
}>) {

  const messages = await getMessages()
  const { locale } = await params

  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"} className={`${blackgold.variable} ${moontime.variable} ${nixieOne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-primary">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
