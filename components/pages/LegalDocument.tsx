import type { ReactNode } from "react";

type LegalDocumentProps = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export function LegalDocument({
  title,
  updatedAt,
  children,
}: LegalDocumentProps) {
  return (
    <div className="min-h-screen w-full px-4 py-16 sm:px-6">
      <article
        lang="fr"
        dir="ltr"
        className="mx-auto max-w-3xl rounded-3xl border border-white/50 bg-white/85 p-6 text-left text-foreground shadow-xl backdrop-blur-sm sm:p-10"
      >
        <header className="border-b border-border/40 pb-6">
          <h1 className="font-third text-5xl leading-tight text-text sm:text-6xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Dernière mise à jour : {updatedAt}
          </p>
        </header>

        <div className="mt-8 space-y-8 text-[15px] leading-7 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3">
          {children}
        </div>
      </article>
    </div>
  );
}
