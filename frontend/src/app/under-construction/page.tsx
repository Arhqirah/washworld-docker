// UnderConstructionPage – midlertidig side der vises for sider der endnu ikke er færdigudviklet.
// Linker tilbage til dashboard så brugeren ikke sidder fast.

import Image from "next/image";
import ErrorPageButton from "../../components/shared/ErrorPageButton";
import { underConstructionPageData } from "@/data/shared/errorPagesData";

export default function UnderConstructionPage() {
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

        <div className="mt-2 flex flex-1 flex-col items-center justify-center gap-6">
          <p className="text-[8rem] leading-none select-none">
            {underConstructionPageData.icon}
          </p>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-white/95">
              {underConstructionPageData.title}
            </h1>
            <div className="mt-3 text-[1rem] font-semibold text-white/80">
              <p>
                {underConstructionPageData.messageLines.filter(Boolean).join(" ")}
              </p>
            </div>
          </div>
        </div>

        <div className="-mx-6 -mb-6 flex w-[calc(100%+3rem)] justify-end pb-[max(0rem,env(safe-area-inset-bottom))]">
          <ErrorPageButton
            href={underConstructionPageData.primaryActionHref}
            className="flex h-12 w-40 items-center justify-end bg-(--brand-green-01) pl-10 pr-4 text-[1.5rem] font-bold text-white [clip-path:polygon(22%_0,100%_0,100%_100%,0_100%)]"
          >
            {underConstructionPageData.primaryActionLabel}
          </ErrorPageButton>
        </div>
      </main>
    </div>
  );
}
