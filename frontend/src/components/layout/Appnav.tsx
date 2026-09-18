"use client";

// AppNav indeholder to navigationselementer:
//   1. Bundmenu (bottom nav) – altid synlig med links til Home, Kort, Profil og Menu-knap.
//   2. Sidebar – skubbes ind fra højre når brugeren trykker Menu.
//      Lukkes automatisk når brugeren navigerer til en ny side (useEffect på pathname).
// Renderes af ScreenLayout.tsx. Bruger ROUTES (lib/routes.ts) til links og useAuth() til logout.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  MapPin,
  User,
  Menu,
  X,
  Car,
  CreditCard,
  BadgeCheck,
  LifeBuoy,
  ChevronRight,
  LogOut,
  History,
  Bell,
} from "lucide-react";
import { useAuth } from "@/hooks";
import { ROUTES } from "@/lib/routes";

export default function AppNav() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  // Luk sidebaren automatisk når brugeren navigerer til en ny URL
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  // Sidebar-menupunkter – tilføj/fjern her for at ændre indholdet af menuen
  const subMenuItems = [
    { label: "Mine Køretøjer", href: ROUTES.cars, icon: Car },
    { label: "Betalingsoplysninger", href: ROUTES.savePaymentCard, icon: CreditCard },
    { label: "Abonnement", href: ROUTES.subscription, icon: BadgeCheck },
    { label: "Kvitteringer", href: ROUTES.washHistory, icon: History },
    { label: "Notifikationer", href: ROUTES.notifications, icon: Bell },
    { label: "Hjælp", href: ROUTES.customerService, icon: LifeBuoy },
  ];

  const menuRoutePrefixes = subMenuItems.map(({ href }) => href.split("?")[0]);

  const isHomeActive = pathname === ROUTES.dashboard;
  const isMapActive =
    pathname.startsWith("/locations") || pathname.startsWith("/details");
  const isProfileActive = pathname.startsWith(ROUTES.profile);
  const isMenuActive =
    menuOpen ||
    menuRoutePrefixes.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    );

  function bottomNavClass(active: boolean) {
    return `flex h-full flex-col items-center justify-center gap-1 transition-colors ${
      active
        ? "text-(--brand-green-01)"
        : "text-white/70 hover:text-white"
    }`;
  }

  return (
    <>
      {/* Halvgennemsigtig baggrund der dækker indholdet mens sidebaren er åben.
          pointer-events-none når lukket så klik ikke blokeres. */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`absolute inset-0 z-40 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar – translateX skubber den ud af syne til højre når lukket */}
      <div
        className={`absolute inset-y-0 right-0 z-50 w-64 bg-(--color-black) shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Log ud-knap øverst i sidebaren */}
        <div className="px-3 pt-8 pb-3 border-b border-white/10">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-3.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-white/5 transition-all group"
          >
            <LogOut size={18} className="group-hover:text-red-300 transition-colors" />
            <span className="text-[0.95rem] font-semibold">Log ud</span>
          </button>
        </div>

        {/* Menupunkter – animate ind fra højre med en lille forsinkelse per punkt (i * 50ms) */}
        <nav className="flex flex-col px-3 pt-3 gap-0.5">
          {subMenuItems.map(({ label, href, icon: Icon }, i) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all group"
              style={{
                transform: menuOpen ? "translateX(0)" : "translateX(16px)",
                opacity: menuOpen ? 1 : 0,
                transition: `color 0.2s, background 0.2s, transform 0.3s ease ${
                  80 + i * 50
                }ms, opacity 0.3s ease ${80 + i * 50}ms`,
              }}
            >
              <Icon
                size={18}
                className="text-white/50 group-hover:text-white transition-colors"
              />
              <span className="text-[0.95rem] font-semibold">{label}</span>
              <ChevronRight size={18} />
            </Link>
          ))}
        </nav>

        {/* Luk-knap i bunden af sidebaren */}
        <div className="mt-auto px-3 pb-6 border-t border-white/10 pt-4">
          <button
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center justify-left gap-3 px-3 py-3.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={18} strokeWidth={2.5} />
            <span className="text-[0.95rem] font-semibold">Luk menu</span>
          </button>
        </div>
      </div>

      {/* Bundmenu – altid synlig. pb-[env(safe-area-inset-bottom)] håndterer
          iPhone home-indikatoren så ikoner ikke gemmes bag den. */}
      <nav className="absolute bottom-0 left-0 right-0 z-30 flex h-22 w-full items-center justify-around bg-(--color-black) pb-[env(safe-area-inset-bottom)] shadow-2xl">
        <Link
          href={ROUTES.dashboard}
          className={bottomNavClass(isHomeActive)}
          aria-current={isHomeActive ? "page" : undefined}
        >
          <Home size={26} strokeWidth={isHomeActive ? 2.5 : 2} />
          <span className={`text-xs ${isHomeActive ? "font-bold" : "font-medium"}`}>
            Home
          </span>
        </Link>
        <Link
          href={ROUTES.map}
          className={bottomNavClass(isMapActive)}
          aria-current={isMapActive ? "page" : undefined}
        >
          <MapPin size={26} strokeWidth={isMapActive ? 2.5 : 2} />
          <span className={`text-xs ${isMapActive ? "font-bold" : "font-medium"}`}>
            Kort
          </span>
        </Link>
        <Link
          href={ROUTES.profile}
          className={bottomNavClass(isProfileActive)}
          aria-current={isProfileActive ? "page" : undefined}
        >
          <User size={26} strokeWidth={isProfileActive ? 2.5 : 2} />
          <span className={`text-xs ${isProfileActive ? "font-bold" : "font-medium"}`}>
            Profil
          </span>
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          className={`${bottomNavClass(isMenuActive)} focus:outline-none`}
          aria-current={isMenuActive ? "page" : undefined}
        >
          <Menu size={26} strokeWidth={isMenuActive ? 2.5 : 2} />
          <span className={`text-xs ${isMenuActive ? "font-bold" : "font-medium"}`}>
            Menu
          </span>
        </button>
      </nav>
    </>
  );
}
