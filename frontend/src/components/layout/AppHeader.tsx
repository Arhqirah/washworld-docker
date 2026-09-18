// AppHeader – den grønne topbar med WashWorld-logo og en tilbageknap.
// Tilbageknappen vises ikke på rod-siderne (dashboard, kort, profil) da der ikke er noget at gå tilbage til.

"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ChevronLeft } from "lucide-react";

const ROOT_PATHS = ["/dashboard", "/locations/map", "/profiles"];

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const showBack = !ROOT_PATHS.includes(pathname);

  return (
    <header className="shrink-0 h-14 bg-[linear-gradient(90deg,var(--brand-green-01)_0%,var(--color-header-dark)_100%)] border-b-[3px] border-(--brand-green-01) relative flex items-center justify-center px-7">
      {showBack && (
        <button
          onClick={() => router.back()}
          aria-label="Gå tilbage"
          className="absolute left-4 text-white/80 hover:text-white transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>
      )}
      <Image
        src="/logos/washworld-white.png"
        alt="Wash World logo"
        width={75}
        height={24}
        loading="eager"
        className="mt-1.5 h-auto w-auto"
      />
    </header>
  );
}
