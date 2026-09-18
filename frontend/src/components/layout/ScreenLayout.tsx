// ScreenLayout er skabelonen for alle sider i appen.
// Wrapper alt indhold i AuthGuard, som håndterer klient-side adgangskontrol.
// Den viser header og bundnavigation på alle sider undtagen login/signup og under-construction.
// useNavVisibility() giver sider mulighed for at skjule navigationen programmatisk (fx 404-siden).

"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import AppNav from "@/components/layout/Appnav";
import AppHeader from "@/components/layout/AppHeader";
import AuthGuard from "@/components/layout/AuthGuard";

const NavVisibilityContext = createContext({
  setHideNav: (_: boolean) => {},
});

export function useNavVisibility() {
  return useContext(NavVisibilityContext);
}

export default function ScreenLayout({ children }: { children: ReactNode }) {
  const [forcedHideNav, setForcedHideNav] = useState(false);
  const pathname = usePathname();
  const hideNavRoutes = new Set(["/login", "/signup", "/500", "/under-construction", "/", "/reset-password", "/reset-password/confirm", "/email-verified", "/terms"]);
  const showNav = !hideNavRoutes.has(pathname) && !forcedHideNav;

  return (
    <NavVisibilityContext.Provider value={{ setHideNav: setForcedHideNav }}>
      <AuthGuard>
        <main className="app-shell">
          <section className="app-screen relative flex min-h-0 flex-col overflow-hidden">
            {showNav && <AppHeader />}
            <div className={`min-h-0 flex-1 overflow-y-auto ${showNav ? "pb-22" : ""}`}>
              {children}
            </div>
            {showNav && <AppNav />}
          </section>
        </main>
      </AuthGuard>
    </NavVisibilityContext.Provider>
  );
}
