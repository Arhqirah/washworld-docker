// ServerErrorPage – 500-fejlsiden der vises ved en alvorlig serverfejl.
// Har samme visuelle stil som 404-siden: mørkegrøn baggrund med hvidt WashWorld-logo og en tilbage-knap.

import Image from "next/image";
import ErrorPageButton from "../../components/shared/ErrorPageButton";
import { unsupportedPageData } from "@/data/shared/errorPagesData";

export default function UnsupportedPage() {
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
            {unsupportedPageData.code}
          </p>

          <div className="mt-auto max-w-4xl mb-6 text-center">
            <h1 className="text-base font-bold leading-[1.12] text-white/95">
              {unsupportedPageData.title}
            </h1>
            <div className="mt-15 text-[1rem] font-semibold text-white">
              <p>
                {unsupportedPageData.messageLines.filter(Boolean).join(" ")}
              </p>
            </div>
          </div>

          <div className="mt-5 -mx-6 -mb-6 flex w-[calc(100%+3rem)] justify-end pb-[max(0rem,env(safe-area-inset-bottom))]">
            <ErrorPageButton
              href={unsupportedPageData.primaryActionHref}
              className="flex h-12 w-40 items-center justify-end bg-(--brand-green-01) pl-10 pr-4 text-[1.5rem] font-bold text-white [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]"
            >
              {unsupportedPageData.primaryActionLabel}
            </ErrorPageButton>
          </div>
        </div>
      </main>
    </div>
  );
}
