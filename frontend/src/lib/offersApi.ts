// offersApi – henter og filtrerer tilbud fra API'et (/api/offers).
// fetchOffers() bruges af dashboard/page.tsx til at vise aktuelle tilbud i "Til dig"-sektionen.
// Tilbud er kun aktive indenfor deres start- og slutdato (isOfferActive).
// getOfferImageSrc() bruges i NewsCard til at validere URL/sti fra databasen.
import { apiRequest } from "@/lib/apiClient";
import type { Offer } from "@/types/api";

/** Returnerer true hvis tilbuddet er aktivt på reference-datoen (kalenderdag). */
export function isOfferActive(
  offer: Offer,
  referenceDate: Date = new Date(),
): boolean {
  const start = new Date(offer.offer_start_date);
  const end = new Date(offer.offer_end_date);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  const dayStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
  const dayEnd = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
    23,
    59,
    59,
    999,
  );

  return start.getTime() <= dayEnd.getTime() && end.getTime() >= dayStart.getTime();
}

export async function fetchOffers(): Promise<Offer[]> {
  const data = await apiRequest<{ offers: Offer[] }>("/api/offers");
  const today = new Date();
  return data.offers.filter((offer) => isOfferActive(offer, today));
}

const DEFAULT_OFFER_IMAGE = "/tilbud.png";

/** Returnerer billedsti/URL fra databasen, ellers fallback. */
export function getOfferImageSrc(
  imageUrl: string | null | undefined,
  fallback = DEFAULT_OFFER_IMAGE,
): string {
  const value = imageUrl?.trim();
  if (!value) return fallback;
  // Accepter kun URL/sti - ingen base64 understøttelse
  if (value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return fallback;
}
