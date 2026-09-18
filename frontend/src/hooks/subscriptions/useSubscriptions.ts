// useSubscriptions – henter brugerens aktive abonnementer.
// Bruges på profiles/page.tsx og details/page.tsx.
//
// removeSubscription(id) opdaterer cachen optimistisk når brugeren opsiger et abonnement,
// så UI'et reagerer med det samme uden at vente på en ny fetch.

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import type { Subscription } from "@/types/api";

export function useSubscriptions(userId: string | undefined) {
  const queryClient = useQueryClient();

  const { data: subscriptions = [] } = useQuery({
    queryKey: QUERY_KEYS.subscriptions(userId ?? ""),
    queryFn: () => fetchUserSubscriptions(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });

  function removeSubscription(subscriptionId: string) {
    queryClient.setQueryData<Subscription[]>(
      QUERY_KEYS.subscriptions(userId ?? ""),
      (prev) => prev?.filter((s) => s.subscription_id !== subscriptionId) ?? [],
    );
  }

  return { subscriptions, removeSubscription };
}
