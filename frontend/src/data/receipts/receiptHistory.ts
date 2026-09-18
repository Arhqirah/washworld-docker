// receiptHistory – UI-tekster og localStorage-hjælper til kvitteringssiden.
// saveLatestSingleWashReceipt() kaldes efter en gennemført betaling for at persistere kvitteringen.

import type { ReceiptDetailFieldKey, ReceiptDetailField, LatestSingleWashReceiptInput } from "@/types/receipts";

export const LATEST_SINGLE_WASH_RECEIPT_KEY =
  "washworld.latestSingleWashReceipt";

export const receiptPageNames = {
  historyTitle: "Kvitteringer",
  detailsTitle: "Detaljer",
  detailButton: "Se detaljer ›",
  detailsSection: "Detaljer",
  priceOverview: "Pris oversigt",
  washLine: "Vask",
  totalLabel: "Total",
} as const;

export const receiptDetailFieldNames: ReceiptDetailField[] = [
  { name: "Vasketype", key: "washType" },
  { name: "Vaskestation", key: "station" },
  { name: "Betaling", key: "payment" },
  { name: "Ordre ID", key: "orderId" },
];

export const receiptActionNames = [
  "Download Kvittering",
  "Send til email",
  "Kontakt support",
] as const;

// Gemmer den seneste enkelt-vaske-kvittering i localStorage så den kan vises i vaskehistorikken.
export function saveLatestSingleWashReceipt(
  latestReceipt: LatestSingleWashReceiptInput,
) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    LATEST_SINGLE_WASH_RECEIPT_KEY,
    JSON.stringify(latestReceipt),
  );
}

