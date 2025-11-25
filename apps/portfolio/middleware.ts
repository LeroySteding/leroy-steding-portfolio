import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/config";

export default createMiddleware({
  locales,
  defaultLocale,
  // 'as-needed' means: Dutch (default) has no prefix, English has /en/
  localePrefix: "as-needed",
});

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Next.js internals (_next)
  // - Vercel internals (_vercel)
  // - Sanity Studio (studio)
  // - Static files (files with extensions)
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
