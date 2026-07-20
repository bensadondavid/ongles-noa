// Better-auth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Intl/
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const protectedPathnames = [
  "/appointments",
  "/confirmation",
  "/confirmed",
  "/options",
  "/prestations",
  "/profile",
  "/reservation",
];

function isProtectedPathname(pathname: string) {
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|he)(?=\/|$)/, "") || "/";

  return protectedPathnames.some(
    (prefix) =>
      pathnameWithoutLocale === prefix ||
      pathnameWithoutLocale.startsWith(`${prefix}/`)
  );
}

function getLocaleFromPathname(pathname: string) {
  const locale = pathname.split("/")[1];

  if (locale === "fr" || locale === "he") {
    return locale;
  }

  return "fr";
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // /dashboard n'est pas localisé : on le sort du middleware next-intl
  // (sinon il redirige vers /fr/dashboard, qui n'existe pas).
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    const sessionCookie = getSessionCookie(req);

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/fr/sign-in", req.url));
    }

    return NextResponse.next();
  }

  if (isProtectedPathname(pathname)) {
    const sessionCookie = getSessionCookie(req);

    if (!sessionCookie) {
      const locale = getLocaleFromPathname(pathname);
      return NextResponse.redirect(new URL(`/${locale}/sign-in`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
