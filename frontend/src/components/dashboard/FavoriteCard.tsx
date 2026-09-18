// FavoriteCard – lokationskort til favorit-karussellen på dashboard.

import Image from "next/image";
import Link from "next/link";
import { dashboardPageNames } from "@/data/dashboard/dashboardData";
import { ROUTES } from "@/lib/routes";

export default function FavoriteCard({
  locationId,
  title,
  address,
  distance,
}: {
  locationId: string;
  title: string;
  address: string;
  distance: string | null;
}) {
  return (
    <Link
      href={ROUTES.details(locationId)}
      className="relative h-32 w-36 shrink-0 overflow-hidden rounded-[3px] bg-black shadow-lg border-2 border-(--brand-green-01) block"
    >
      <Image
        src="/locations-pictures/Herlev.jpg"
        alt={title}
        className="h-full w-full object-cover opacity-80"
        fill
        sizes="144px"
        quality={75}
        loading="eager"
      />
      <div className="absolute inset-0 flex flex-col justify-between">
        <div className="px-3 pt-3">
          <h3 className="text-sm font-bold leading-tight text-white">{title}</h3>
          <p className="text-xs leading-tight text-white/70">{address}</p>
        </div>
        <p className="absolute bottom-1.5 left-2.5 z-10 text-sm font-bold text-(--brand-green-01)">
          {distance ?? "—"}
        </p>
        <div className="absolute -right-px -bottom-px h-6">
          <span className="flex h-full items-center justify-end bg-(--brand-green-01) pl-6 pr-2 text-xs leading-none font-bold text-white [clip-path:polygon(24%_0,101%_0,101%_101%,0_101%)]">
            {dashboardPageNames.favoriteCardButton}
          </span>
        </div>
      </div>
    </Link>
  );
}
