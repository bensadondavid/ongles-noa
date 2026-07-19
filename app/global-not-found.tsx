import "./globals.css";
import type { Metadata } from "next";
import { blackgold } from "@/lib/fonts/fonts";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page introuvable",
  description: "La page que vous recherchez n'existe pas.",
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={`${blackgold.variable} antialiased`}>
      <body className="flex min-h-screen items-center justify-center bg-white px-4 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-[#cdbbb2]/50 bg-accent p-8 text-center shadow-[0_18px_45px_rgba(90,65,55,0.12)]">
          <h1 className="font-third text-4xl text-border">Page introuvable</h1>
          <p className="mt-4 text-sm leading-6 text-[#6f574e]">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-full bg-[#7d6258] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6b5148]"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </body>
    </html>
  );
}
