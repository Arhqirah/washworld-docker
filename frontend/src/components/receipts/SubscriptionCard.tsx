// SubscriptionCard – kvitteringskort for ét abonnement i vaskehistorikken.

import Link from "next/link";
import Image from "next/image";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";
import { LicensePlate } from "@/components/shared/LicensePlate";
import { receiptPageNames } from "@/data/receipts/receiptHistory";
import {
  formatWashDate,
  formatWashTime,
  formatPrice,
  type ReceiptItem,
} from "@/lib/washLogApi";
import { ROUTES } from "@/lib/routes";

export default function SubscriptionCard({ item }: { item: Extract<ReceiptItem, { kind: "subscription" }> }) {
  const { entry } = item;
  const isActive = entry.subscriptions_status === "aktiv";

  return (
    <article className="relative w-full overflow-hidden rounded-[3px] bg-white text-left shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
      <div className="flex items-start gap-3 px-3 pb-2 pt-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-white">
          <Image
            src="/icons/EnkeltVaskIcon.png"
            alt="Abonnement"
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 pr-2">
              <h3 className="text-[15px] font-bold text-neutral-950">
                {entry.subscriptions_name}
              </h3>
              <div className="mt-1.5">
                <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-600">
                  <CalendarDaysIcon className="h-3 w-3 shrink-0 text-neutral-500" />
                  <span>
                    {formatWashDate(entry.subscriptions_start_date)} ·{" "}
                    {formatWashTime(entry.subscriptions_start_date)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2 pt-0.5">
              <span
                className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-emerald-400 text-emerald-900"
                    : "bg-neutral-300 text-neutral-600"
                }`}
              >
                {isActive ? "Aktiv" : entry.subscriptions_status}
              </span>
              <p className="text-[18px] font-bold text-neutral-950">
                {formatPrice(entry.subscriptions_price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-neutral-200" />

      <div className="flex items-end justify-between gap-3 px-3 pb-3 pt-3 pr-36">
        <LicensePlate plate={entry.car_license_plate} />
      </div>

      <Link
        href={`${ROUTES.washHistoryDetails}?kind=subscription&id=${entry.subscription_id}`}
        className="absolute bottom-0 right-0 inline-flex h-10 items-center bg-(--brand-green-01) px-4 text-sm font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
      >
        {receiptPageNames.detailButton}
      </Link>
    </article>
  );
}
