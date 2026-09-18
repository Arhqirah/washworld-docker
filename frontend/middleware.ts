// middleware – server-side ruteguard der kører på Edge-runtime ved hvert sidebesøg.
// Læser JWT-token fra cookie (sat af saveToken() i apiClient.ts) og:
//   • Omdirigerer ikke-loggede brugere til /login for alle beskyttede ruter.
//   • Omdirigerer allerede-loggede brugere væk fra /login og /signup til /dashboard.
//   • Videresender alle andre kald uden ændringer.
// AuthGuard.tsx udgør et supplerende klient-side lag der håndterer edge cases (fx udløbet token).

import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/login",
  "/signup",
  "/reset-password",
  "/reset-password/confirm",
  "/email-verified",
  "/505",
  "/under-construction",
  "/terms",
]);

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.has(pathname);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // Root redirecter til dashboard hvis logget ind, ellers login
  if (pathname === "/") {
    const dest = request.nextUrl.clone();
    dest.pathname = token ? "/dashboard" : "/login";
    return NextResponse.redirect(dest);
  }

  if (isPublicRoute(pathname)) {
    // Allerede logget ind → send til dashboard i stedet for login/signup
    if (token && (pathname === "/login" || pathname === "/signup")) {
      const dest = request.nextUrl.clone();
      dest.pathname = "/dashboard";
      return NextResponse.redirect(dest);
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
