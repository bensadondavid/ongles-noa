import type { Metadata } from "next";
import "../globals.css";
import {NextIntlClientProvider} from 'next-intl';
import { getMessages } from "next-intl/server";
import { blackgold, moontime } from "@/lib/fonts/fonts";

export const metadata: Metadata = {
  title: "Noa Bensadon",
  description: "",
};

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
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"} className={`${blackgold.variable} ${moontime.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
