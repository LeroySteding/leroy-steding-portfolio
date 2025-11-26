import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { defaultLocale, locales } from "./i18n/config";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  // 'as-needed' means: Dutch (default) has no prefix, English has /en/
  localePrefix: "as-needed",
});

export default function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";

  // If on studio subdomain, rewrite to /studio route
  if (hostname.startsWith("studio.")) {
    const url = request.nextUrl.clone();
    // Rewrite all requests on studio subdomain to /studio/[[...tool]]
    url.pathname = `/studio${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // For main domain, use next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Next.js internals (_next)
  // - Vercel internals (_vercel)
  // - Sanity Studio (studio) on main domain
  // - Static files (files with extensions)
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
