// VaskehistorikDetaljer – detaljeside for én vask eller ét abonnement.
// URL-parametrene ?kind=wash&id=... eller ?kind=subscription&id=... bestemmer hvad der vises.

"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import PageInfo from "@/components/shared/PageInfo";
import WashDetail from "@/components/receipts/WashDetail";
import SubscriptionDetail from "@/components/receipts/SubscriptionDetail";
import { receiptPageNames } from "@/data/receipts/receiptHistory";
import { fetchWashLog } from "@/lib/washLogApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import { fetchUserCars } from "@/lib/carsApi";
import { useAuth } from "@/hooks";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Subscription } from "@/types/api";

export default function VaskehistorikDetaljer() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const kind = searchParams.get("kind") ?? "wash";
  const id = searchParams.get("id") ?? "";

  const { data: washEntries, isLoading: washLoading } = useQuery({
    queryKey: QUERY_KEYS.washLog(user?.user_id ?? ""),
    queryFn: () => fetchWashLog(user!.user_id),
    enabled: !!user && kind === "wash",
    staleTime: 1000 * 60 * 5,
  });

  const { data: subData, isLoading: subLoading } = useQuery({
    queryKey: QUERY_KEYS.subscriptionDetail(user?.user_id ?? ""),
    queryFn: async () => {
      const [subs, cars] = await Promise.all([
        fetchUserSubscriptions(user!.user_id),
        fetchUserCars(user!.user_id),
      ]);
      return { subs, cars };
    },
    enabled: !!user && kind === "subscription",
    staleTime: 1000 * 60 * 5,
  });

  const washEntry = washEntries?.find((e) => e.wash_log_id === id) ?? null;

  const subEntry = useMemo<(Subscription & { car_license_plate: string }) | null>(() => {
    if (!subData) return null;
    const plateByCarId = Object.fromEntries(subData.cars.map((c) => [c.car_id, c.car_license_plate]));
    const sub = subData.subs.find((s) => s.subscription_id === id) ?? null;
    if (!sub) return null;
    return { ...sub, car_license_plate: plateByCarId[sub.car_id] ?? "—" };
  }, [subData, id]);

  const isLoading = kind === "wash" ? washLoading : subLoading;

  if (isLoading) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
        <p className="mt-8 text-center text-sm font-semibold text-white">Henter detaljer...</p>
      </div>
    );
  }

  if (kind === "wash" && washEntry) return <WashDetail entry={washEntry} />;
  if (kind === "subscription" && subEntry) return <SubscriptionDetail entry={subEntry} />;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <PageInfo text={receiptPageNames.detailsTitle} userName={""} />
      <p className="mt-8 text-center text-sm font-semibold text-white">Ingen detaljer fundet.</p>
    </div>
  );
}
