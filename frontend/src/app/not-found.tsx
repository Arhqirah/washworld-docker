// NotFound – 404-siden der vises når brugeren navigerer til en URL der ikke eksisterer.
// Skjuler navigationsmenuen (setHideNav) da 404-siden er en standalone fejlside.

"use client";

import { useEffect } from "react";
import Image from "next/image";

import ErrorPageButton from "../components/shared/ErrorPageButton";
import { notFoundPageData } from "@/data/shared/errorPagesData";
import { useNavVisibility } from "@/hooks";

export default function NotFound() {
  const { setHideNav } = useNavVisibility();

  useEffect(() => {
    setHideNav(true);
    return () => setHideNav(false);
  }, [setHideNav]);
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-[linear-gradient(rgba(7,56,31,0.46),rgba(7,56,31,0.46)),url('/background/washworld-background.png')] bg-cover bg-position-[center_bottom] text-white">
      <main className="flex flex-1 flex-col overflow-y-auto px-6 pb-6 pt-8 scrollbar-hide">
        <Image
          src="/logos/washworld-white.png"
          alt="Wash World"
          width={246}
          height={112}
          style={{ width: "auto" }}
          className="mx-auto"
          priority
        />

        <div className="relative mt-2 flex flex-1 flex-col items-center">
          <p className="pointer-events-none absolute inset-x-0 top-40 flex items-center justify-center text-center select-none text-[12rem] leading-none font-bold tracking-tight text-white/10">
            {notFoundPageData.code}
          </p>

          <div className="mt-auto max-w-4xl mb-6 text-center">
            <h1 className="text-base font-bold leading-[1.12] text-white/95">
              {notFoundPageData.title}
            </h1>
            <div className="mt-15 text-[1rem] font-semibold text-white">
              <p>{notFoundPageData.messageLines.join(" ")}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 -mx-6 -mb-6 flex w-[calc(100%+3rem)] justify-end pb-[max(0rem,env(safe-area-inset-bottom))]">
          <ErrorPageButton
            href={notFoundPageData.primaryActionHref}
            className="flex h-12 w-40 items-center justify-end bg-(--brand-green-01) pl-10 pr-4 text-[1.5rem] font-bold text-white [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]"
          >
            {notFoundPageData.primaryActionLabel}
          </ErrorPageButton>
        </div>
      </main>
    </div>
  );
}
