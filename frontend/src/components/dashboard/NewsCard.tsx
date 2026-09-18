// NewsCard – tilbudskort til nyheds-karussellen på dashboard.

import Image from "next/image";
import Link from "next/link";
import { getOfferImageSrc } from "@/lib/offersApi";
import type { Offer } from "@/types/api";
import { ROUTES } from "@/lib/routes";

export default function NewsCard({ offer }: { offer: Offer }) {
  const imageSrc = getOfferImageSrc(offer.offer_photo_url);

  return (
    <Link
      href={ROUTES.underConstruction}
      className="w-46 shrink-0 overflow-hidden rounded-[3px] border-white/90 bg-white shadow-md block"
    >
      <Image
        src={imageSrc}
        alt={offer.offer_description}
        className="h-20 w-full object-cover"
        width={184}
        height={80}
        quality={75}
        loading="eager"
      />
      <p className="px-2 py-2 text-sm font-bold leading-tight text-neutral-600">
        {offer.offer_description}
      </p>
    </Link>
  );
}
