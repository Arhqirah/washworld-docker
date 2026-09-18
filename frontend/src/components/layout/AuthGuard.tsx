"use client";

// AuthGuard – klient-side adgangskontrol der supplerer middleware.ts.
// Middleware kan kun læse cookie-tokenet; AuthGuard verificerer at React-sessionen
// (AuthContext) er korrekt indlæst og omdirigerer til /login hvis ikke.
// Viser en spinner mens sessionen verificeres ved opstart.

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks";

const PUBLIC_ROUTES = new Set([
  "/login",
  "/signup",
  "/reset-password",
  "/reset-password/confirm",
  "/email-verified",
  "/500",
  "/under-construction",
  "/terms",
]);

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.has(pathname);
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && !isPublicRoute(pathname)) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  if (isPublicRoute(pathname)) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-300 border-t-(--brand-green-01)" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
