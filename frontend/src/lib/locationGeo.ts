// locationGeo – geografiske hjælpefunktioner til afstandsberegning og åbningstidsformatering.
// haversineKm() og formatKmDa() bruges af Map.tsx og LocationsList.tsx til afstandsvisning.
// formatOpenHoursDisplay() og locationShortName() bruges af LocationPopupCard.tsx.

const EARTH_RADIUS_KM = 6371;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Afstand mellem to punkter som [lng, lat] — grov men fin til "km væk". */
export function haversineKm(
  from: [number, number],
  to: [number, number],
): number {
  const [lng1, lat1] = from;
  const [lng2, lat2] = to;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/** Dansk kilometerstreng, fx "7,6 km" */
export function formatKmDa(km: number): string {
  return `${km.toFixed(1).replace(".", ",")} km`;
}

/** Gør "7-22" til "07-22" til visning — matcher det I har i datasættet. */
export function formatOpenHoursDisplay(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "—";

  const parts = trimmed.split("-").map((s) => s.trim());
  if (parts.length < 2) return trimmed;

  const padHour = (h: string): string =>
    /^\d{1,2}$/.test(h) ? h.padStart(2, "0") : h;

  return `${padHour(parts[0])}-${padHour(parts[1])}`;
}

/** Kun by/navn-delen: første ord før mellemrum, fx "Slagelse - Smedegade" → "Slagelse". */
export function locationShortName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first ?? "";
}
