import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Support both legacy client cookie (sig_token) and secure server-set HttpOnly cookies (access_token, refresh_token)
  const hasSession =
    Boolean(request.cookies.get("sig_token")?.value) ||
    Boolean(request.cookies.get("access_token")?.value) ||
    Boolean(request.cookies.get("refresh_token")?.value);

  const { pathname } = request.nextUrl;
  const host = (request.headers.get("host") || "").toLowerCase();

  // 1. Session Protection for authenticated dashboard & editor routes
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/signatures") ||
    pathname.startsWith("/team-signatures") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/design-studio") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/settings")
  ) {
    if (!hasSession) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Redirect authenticated users away from auth pages to dashboard
  if ((pathname === "/login" || pathname === "/signup") && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const response = NextResponse.next();

  // 3. Pre-launch & Temporary Website Protection:
  // If NEXT_PUBLIC_PRE_LAUNCH="true", or if accessing via non-production host
  // (e.g. *.vercel.app, staging, IP addresses, localhost), apply X-Robots-Tag: noindex, nofollow.
  // Never rely on robots.txt alone to prevent search engine indexing of temporary/staging sites.
  const isExplicitPreLaunch = process.env.NEXT_PUBLIC_PRE_LAUNCH === "true";
  const isTemporaryDomain =
    host.includes(".vercel.app") ||
    host.startsWith("10.") ||
    host.startsWith("172.") ||
    host.startsWith("192.");

  const isPrivateRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/signatures") ||
    pathname.startsWith("/team-signatures") ||
    pathname.startsWith("/design-studio") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/help") ||
    pathname.startsWith("/templates") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/s/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot" ||
    pathname === "/reset" ||
    pathname === "/verify" ||
    pathname === "/404";

  if (isExplicitPreLaunch || isTemporaryDomain || isPrivateRoute) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public files with image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
