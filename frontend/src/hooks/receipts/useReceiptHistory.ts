// useReceiptHistory – henter brugerens fulde vaskehistorik og bygger en samlet kronologisk liste.
// Bruges på receipts/page.tsx.
//
// Henter tre endpoints parallelt og kombinerer dem:
//   - QUERY_KEYS.receiptHistory → washLog + subscriptions + cars → buildReceiptList()
//
// Hvert element har kind = "wash" eller kind = "subscription".

import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchWashLog, buildReceiptList, type ReceiptItem } from "@/lib/washLogApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import { fetchUserCars } from "@/lib/carsApi";

export function useReceiptHistory(userId: string | undefined) {
  const { data: items = [], isLoading, error } = useQuery<ReceiptItem[]>({
    queryKey: QUERY_KEYS.receiptHistory(userId ?? ""),
    queryFn: async () => {
      const [washLog, subscriptions, cars] = await Promise.all([
        fetchWashLog(userId!),
        fetchUserSubscriptions(userId!),
        fetchUserCars(userId!),
      ]);
      return buildReceiptList(washLog, subscriptions, cars);
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  return {
    items,
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
