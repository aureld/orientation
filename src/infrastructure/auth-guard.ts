import { routing } from "@/i18n/routing";

const PUBLIC_PATHS = ["/", "/login", "/register"];

const localePrefix = new RegExp(
  `^/(${routing.locales.join("|")})(?=/|$)`
);

/**
 * Returns true when the pathname does NOT require authentication.
 * Strips the locale prefix before matching against PUBLIC_PATHS.
 */
export function isPublicPath(pathname: string): boolean {
  const withoutLocale = pathname.replace(localePrefix, "") || "/";
  return PUBLIC_PATHS.some(
    (p) => withoutLocale === p || withoutLocale.startsWith(p + "/")
  );
}
