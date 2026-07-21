import type { Metadata } from "next";
import "../globals.css";
import { Nixie_One } from "next/font/google";
import { Toaster } from "sonner";
import { AppSidebarDashboard } from "@/components/app-sidebar-dashboard";
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

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
        <SidebarProvider className="min-h-0 h-screen">
          <AppSidebarDashboard />
          <SidebarInset>
            <SidebarTrigger className="absolute top-4 left-4 z-20" />
            {children}
          </SidebarInset>
        </SidebarProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
