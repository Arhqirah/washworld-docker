// StatusBadge – viser abonnementsnavn eller "Intet abonnement" som et farvet badge.

import { capitalizeName } from "@/lib/formatName";

export default function StatusBadge({ subscriptionName }: { subscriptionName: string | null }) {
  const hasSubscription = Boolean(subscriptionName);
  return (
    <span
      className={`inline-flex h-7 shrink-0 items-center justify-center whitespace-nowrap rounded-sm px-2 text-center text-sm font-bold text-white ${
        hasSubscription ? "bg-(--brand-green-01)" : "bg-neutral-600"
      }`}
    >
      {hasSubscription ? capitalizeName(subscriptionName!) : "Intet abonnement"}
    </span>
  );
}
