import type { Metadata } from "next";
import "../globals.css";
import { Nixie_One } from "next/font/google";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Tableau de bord",
  description: "Gestion des disponibilités",
};

const nixieOne = Nixie_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nixie-one",
  display: "swap",
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${nixieOne.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-primary text-white">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
