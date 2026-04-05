import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./src/i18n/routing";
import { isPublicPath } from "./src/infrastructure/auth-guard";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest): Response {
  const { pathname } = req.nextUrl;

  if (!isPublicPath(pathname)) {
    const hasSession =
      req.cookies.has("authjs.session-token") ||
      req.cookies.has("__Secure-authjs.session-token");

    if (!hasSession) {
      const localeMatch = pathname.match(
        new RegExp(`^/(${routing.locales.join("|")})`)
      );
      const locale = localeMatch?.[1] || routing.defaultLocale;
      return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
