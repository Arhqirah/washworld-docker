// Vaskehistorik (receipts/page.tsx) – viser brugerens alle tidligere vaske og abonnementer.
// Poster hentes og kombineres af useReceiptHistory og vises som kronologisk liste af kort.

"use client";

import PageInfo from "@/components/shared/PageInfo";
import WashCard from "@/components/receipts/WashCard";
import SubscriptionCard from "@/components/receipts/SubscriptionCard";
import { receiptPageNames } from "@/data/receipts/receiptHistory";
import { useAuth, useReceiptHistory } from "@/hooks";

export default function Vaskehistorik() {
  const { user } = useAuth();
  const { items, isLoading, error } = useReceiptHistory(user?.user_id);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.historyTitle} userName={""} />

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-3 px-5 py-4">
          {isLoading && (
            <p className="text-center text-sm font-semibold text-white">
              Henter kvitteringer...
            </p>
          )}
          {error && (
            <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
            </p>
          )}
          {!isLoading && !error && items.length === 0 && (
            <p className="text-center text-sm font-semibold text-white">
              Ingen kvitteringer endnu.
            </p>
          )}

          {items.map((item) =>
            item.kind === "wash" ? (
              <WashCard key={item.entry.wash_log_id} item={item} />
            ) : (
              <SubscriptionCard key={item.entry.subscription_id} item={item} />
            ),
          )}
        </main>
      </div>
    </div>
  );
}
