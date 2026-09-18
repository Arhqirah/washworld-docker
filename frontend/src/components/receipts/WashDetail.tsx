// WashDetail – detaljeret kvitteringsvisning for én enkelt vask.

import Image from "next/image";
import {
  CalendarDaysIcon,
  ClockIcon,
  CurrencyDollarIcon,
  MapPinIcon,
} from "@heroicons/react/24/solid";
import PageInfo from "@/components/shared/PageInfo";
import ReceiptActionList from "@/components/receipts/ReceiptActionList";
import { receiptPageNames } from "@/data/receipts/receiptHistory";
import {
  formatWashDate,
  formatWashTime,
  washLogIcon,
  formatPrice,
} from "@/lib/washLogApi";
import type { WashLogEntry } from "@/types/api";

export default function WashDetail({ entry }: { entry: WashLogEntry }) {
  const locationDisplay =
    entry.location_address && entry.location_zipcode
      ? `${entry.location_address}, ${entry.location_zipcode}`
      : entry.location_name ?? "—";

  const details = [
    { name: "Vasketype", value: entry.product_name ?? "—" },
    { name: "Vaskestation", value: entry.location_name ?? "—" },
    { name: "Lokation", value: locationDisplay },
    { name: "Ordre ID", value: `#${entry.wash_log_id.slice(0, 8).toUpperCase()}` },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-4 px-5 py-4">
          <article className="rounded-[3px] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
            <div className="flex items-start gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden border border-neutral-400 bg-white">
                <Image src={washLogIcon(entry.product_name)} alt={entry.product_name ?? "Vask"} fill className="object-cover" sizes="48px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="text-[15px] font-bold text-neutral-950">{entry.product_name ?? "Enkelt vask"}</h1>
                  <span className="shrink-0 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-400 text-emerald-900">Gennemført</span>
                </div>
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <MapPinIcon className="h-3 w-3 shrink-0" /><span className="truncate">{locationDisplay}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <CalendarDaysIcon className="h-3 w-3 shrink-0" /><span>{formatWashDate(entry.wash_log_start_time)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-neutral-300">
                    <ClockIcon className="h-3 w-3 shrink-0" /><span>{formatWashTime(entry.wash_log_start_time)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 h-px bg-neutral-200" />
            <div className="mt-4 flex h-10 w-fit overflow-hidden border-2 border-neutral-800 bg-white text-neutral-950">
              <span className="flex w-6 items-center justify-center bg-[#327fc2]" />
              <span className="flex items-center px-3 text-[15px] font-bold tracking-[0.08em]">{entry.car_license_plate}</span>
            </div>

            <section className="mt-5">
              <h2 className="text-[13px] font-bold text-neutral-900">{receiptPageNames.detailsSection}</h2>
              <div className="mt-2 h-px bg-neutral-200" />
              <dl className="space-y-2 pt-4 text-[13px] text-neutral-600">
                {details.map((f) => (
                  <div key={f.name} className="flex items-center justify-between gap-3">
                    <dt>{f.name}</dt><dd className="text-right text-neutral-700">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-5">
              <div className="flex items-center gap-2 text-[13px] font-bold text-neutral-900">
                <CurrencyDollarIcon className="h-4 w-4 text-(--brand-green-01)" />
                <h2>{receiptPageNames.priceOverview}</h2>
              </div>
              <div className="mt-2 h-px bg-neutral-200" />
              <div className="flex items-center justify-between gap-3 py-4 text-[13px] text-neutral-700">
                <p>{receiptPageNames.washLine}</p>
                <p>{entry.product_name ?? "—"}</p>
                <p>{formatPrice(entry.product_price)}</p>
              </div>
            </section>

            <div className="mt-16 h-px bg-neutral-200" />
            <div className="flex items-center justify-between pt-4">
              <p className="text-2xl font-bold text-neutral-950">{receiptPageNames.totalLabel}</p>
              <p className="text-2xl font-bold text-(--brand-green-01)">{formatPrice(entry.product_price)}</p>
            </div>
          </article>
          <ReceiptActionList />
        </main>
      </div>
    </div>
  );
}
