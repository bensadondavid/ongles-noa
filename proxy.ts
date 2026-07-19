// Better-auth
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Intl
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

function isPublicPathname(pathname: string) {
  const pathnameWithoutLocale = pathname.replace(/^\/(fr|he)(?=\/|$)/, "") || "/";

  return (
    pathnameWithoutLocale === "/" ||
    pathnameWithoutLocale === "/sign-in" ||
    pathnameWithoutLocale === "/sign-up" ||
    pathnameWithoutLocale === "/forgot-password"
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

  if (!isPublicPathname(pathname)) {
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
