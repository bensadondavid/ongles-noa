"use client";

import "./globals.css";

export default function GlobalError({
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen items-center justify-center bg-white px-4 font-sans">
        <div className="w-full max-w-md rounded-3xl border border-[#cdbbb2]/50 p-8 text-center shadow-[0_18px_45px_rgba(90,65,55,0.12)]">
          <h1 className="text-2xl font-semibold text-[#5f4941]">
            Une erreur est survenue
          </h1>
          <p className="mt-3 text-sm text-[#6f574e]">
            Quelque chose s&apos;est mal passé. Veuillez réessayer.
          </p>
          <button
            onClick={() => unstable_retry()}
            className="mt-6 rounded-full bg-[#7d6258] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#6b5148]"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
