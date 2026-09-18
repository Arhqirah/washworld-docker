// washLogApi indeholder API-kald og hjælpefunktioner til vaskehistorik.
// En "wash log"-post oprettes hver gang en bruger starter en vask via appen.

import { apiRequest } from "@/lib/apiClient";
import type { WashLogEntry, Subscription } from "@/types/api";

// Opretter en ny vaskepost når en vask startes.
// Returnerer det nye wash_log_id som kan bruges til opfølgning.
export async function createWashLog(input: {
  car_id: string;
  product_id?: string;    // Hvilket vaskeprogrammet der vælges
  location_id?: string;   // Hvilken vaskehal det foregår på
  wash_log_price?: number; // Prisen for vasken
}): Promise<{ wash_log_id: string }> {
  return apiRequest("/api/wash_log", { method: "POST", body: input });
}

// Henter alle vaskeposter for en bestemt bruger (brugt på vaskehistorik-siden)
export async function fetchWashLog(userId: string): Promise<WashLogEntry[]> {
  const data = await apiRequest<{ wash_log: WashLogEntry[] }>(
    `/api/wash_log?user_id=${encodeURIComponent(userId)}`,
  );
  return data.wash_log;
}

// ReceiptItem er enten en enkelt vask eller et abonnement — begge vises i kvitteringslisten
export type ReceiptItem =
  | { kind: "wash"; entry: WashLogEntry }
  | { kind: "subscription"; entry: Subscription & { car_license_plate: string } };

// Kombinerer vask-poster og abonnementer til én samlet liste sorteret efter dato (nyeste først).
// Slår også nummerplade op fra bil-listen så den kan vises ved hvert abonnement.
export function buildReceiptList(
  washLog: WashLogEntry[],
  subscriptions: Subscription[],
  cars: { car_id: string; car_license_plate: string }[],
): ReceiptItem[] {
  // Lav et opslag bil-ID → nummerplade for hurtig søgning
  const plateByCarId = Object.fromEntries(cars.map((c) => [c.car_id, c.car_license_plate]));

  const washItems: ReceiptItem[] = washLog.map((entry) => ({
    kind: "wash",
    entry,
  }));

  const subItems: ReceiptItem[] = subscriptions.map((sub) => ({
    kind: "subscription",
    entry: { ...sub, car_license_plate: plateByCarId[sub.car_id] ?? "—" },
  }));

  // Sorter kombineret liste efter dato, nyeste øverst
  return [...washItems, ...subItems].sort((a, b) => {
    const dateA = a.kind === "wash"
      ? a.entry.wash_log_start_time
      : a.entry.subscriptions_start_date;
    const dateB = b.kind === "wash"
      ? b.entry.wash_log_start_time
      : b.entry.subscriptions_start_date;
    return new Date(dateB).getTime() - new Date(dateA).getTime();
  });
}

// Formaterer en ISO-dato til dansk datoformat, fx "24. maj 2026"
export function formatWashDate(isoString: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoString));
}

// Formaterer en ISO-dato til klokkeslæt, fx "14:32"
export function formatWashTime(isoString: string): string {
  return new Intl.DateTimeFormat("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoString));
}

// Returnerer det rigtige ikon-billede baseret på vasketypen (selvvask eller automask)
export function washLogIcon(productName: string | null): string {
  const lower = (productName ?? "").toLowerCase();
  if (lower.includes("selv")) return "/icons/VaskSelvIcon.png";
  return "/icons/EnkeltVaskIcon.png";
}

// Formaterer en pris til dansk format, fx "149 kr." — viser "—" hvis prisen mangler
export function formatPrice(price: number | string | null): string {
  if (price === null || price === undefined) return "—";
  return `${Number(price).toFixed(0)} kr.`;
}
