import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Support both legacy client cookie (sig_token) and secure server-set HttpOnly cookies (access_token, refresh_token)
  const hasSession =
    Boolean(request.cookies.get("sig_token")?.value) ||
    Boolean(request.cookies.get("access_token")?.value) ||
    Boolean(request.cookies.get("refresh_token")?.value);

  const { pathname } = request.nextUrl;

  // Protect /dashboard, /signatures, /team-signatures, /templates, /pricing, /design-studio and nested routes
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

  // Redirect authenticated users away from auth pages to dashboard
  if ((pathname === "/login" || pathname === "/signup") && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signatures/:path*",
    "/team-signatures/:path*",
    "/team-signatures",
    "/templates/:path*",
    "/pricing/:path*",
    "/design-studio/:path*",
    "/help/:path*",
    "/help",
    "/settings/:path*",
    "/settings",
    "/login",
    "/signup",
  ],
};
