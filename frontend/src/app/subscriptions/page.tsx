// AbonnementPage – valg og oprettelse af abonnement.
// Brugeren vælger abonnementstype (Guld/Premium/Brilliant), om det gælder alle lokationer,
// og hvilken lokation de ønsker at vaske ved. Herefter sendes de til betaling eller bekræftelse.
//
// Hooks der bruges:
//   usePlanCarousel() → styrer planvalg, animationsretning og animKey (hooks/usePlanCarousel.ts)
//
// Komponenter der bruges:
//   PageInfo     → sidetitel øverst
//   PlanFeature  → viser én feature/fordel på plankortet (components/PlanFeature.tsx)
//
// Slide-animationerne (.slide-right / .slide-left) er defineret i globals.css.
// Hvis brugeren mangler betalingskort sendes de til /subscriptions/payment, ellers til /subscriptions/newsubscription.

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getMissingProfileInfoState } from "@/data/profile/profileData";
import { subscriptionPageNames, subscriptionPlans } from "@/data/subscriptions/subscriptionData";
import { fetchMapLocations } from "@/lib/locationsApi";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { ROUTES } from "@/lib/routes";
import PageInfo from "@/components/shared/PageInfo";
import { PlanFeature } from "@/components/wash/PlanFeature";
import { usePlanCarousel } from "@/hooks";

const PLANS = ["Guld", "Premium", "Brilliant"];

export default function AbonnementPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId") ?? undefined;
  const { missingPaymentCard } = getMissingProfileInfoState();

  const { selectedIndex, slideDirection, animKey, selectPlan } = usePlanCarousel();
  const [allLocations, setAllLocations] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [locationError, setLocationError] = useState(false);

  const { data: locations = [], isLoading: locationsLoading } = useQuery({
    queryKey: QUERY_KEYS.locations(),
    queryFn: fetchMapLocations,
    staleTime: 1000 * 60 * 5,
  });

  const selectedPlan = PLANS[selectedIndex];
  const currentPlan = subscriptionPlans.find((plan) => plan.name === selectedPlan);

  function handleCreateSubscription() {
    if (!allLocations && !selectedLocationId) {
      setLocationError(true);
      return;
    }
    setLocationError(false);
    const locationId = allLocations ? undefined : selectedLocationId;

    if (missingPaymentCard) {
      router.push(ROUTES.subscriptionPayment(selectedPlan.toLowerCase(), carId, allLocations, locationId));
    } else {
      router.push(ROUTES.subscriptionConfirmation(selectedPlan.toLowerCase(), carId, allLocations, locationId));
    }
  }

  return (
    <div className="min-h-full flex flex-col">
      <PageInfo text={subscriptionPageNames.listTitle} userName="" />

      <section className="flex flex-1 flex-col px-7 pt-6 pb-6 text-center text-white">
        <h2 className="text-[1.9rem] font-bold leading-tight">
          {subscriptionPageNames.createTitleLineOne}
          <br />
          {subscriptionPageNames.createTitleLineTwo}
        </h2>

        <p className="mx-auto mt-5 max-w-67.5 text-[0.9rem] font-bold leading-tight">
          {subscriptionPageNames.createDescription}
        </p>

        {/* Planfaner */}
        <div className="mt-5 flex items-center justify-between gap-5">
          {PLANS.map((name, index) => (
            <button
              key={name}
              type="button"
              onClick={() => selectPlan(index)}
              className={`h-7.5 flex-1 rounded-[3px] text-[0.85rem] font-bold text-black transition ${
                selectedIndex === index
                  ? "bg-(--color-surface)"
                  : "bg-(--color-grey-03) ring-2 ring-(--brand-green-01) opacity-50"
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Animeret plankort */}
        {currentPlan && (
          <div
            key={animKey}
            className={`mx-auto mt-7 w-[82%] overflow-hidden rounded-[3px] bg-(--white-white) shadow-lg ${
              slideDirection === "right" ? "slide-right" : "slide-left"
            }`}
          >
            <div className="bg-(--brand-green-01) px-6 py-5 text-center text-white">
              <h2 className="text-[2rem] font-bold leading-none">{currentPlan.name}</h2>
              <p className="mt-2 text-[1.35rem] font-bold">{currentPlan.price}</p>
            </div>

            <div className="px-5 py-4">
              <h3 className="mb-4 text-center text-[1.15rem] font-bold text-black">
                {currentPlan.description}
              </h3>
              <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-[0.75rem] font-medium text-black">
                {currentPlan.features.map((feature) => (
                  <PlanFeature key={feature.text} text={feature.text} level={feature.level} />
                ))}
              </div>
            </div>

            {/* Alle lokationer-tjekboks */}
            <label className="mx-5 mb-2 flex cursor-pointer items-start gap-3 rounded-[3px] border border-(--brand-green-01)/30 bg-(--brand-green-01)/5 px-3 py-2.5">
              <input
                type="checkbox"
                checked={allLocations}
                onChange={(e) => {
                  setAllLocations(e.target.checked);
                  if (e.target.checked) setLocationError(false);
                }}
                className="mt-0.5 h-4 w-4 shrink-0 accent-(--brand-green-01)"
              />
              <span className="text-left text-[0.75rem] font-semibold leading-snug text-black">
                Adgang til alle WashWorlds{" "}
                <span className="font-bold text-(--brand-green-01)">+10 kr/md.</span>
              </span>
            </label>

            {/* Lokationsvælger */}
            {!allLocations && (
              <div className="mx-5 mb-4">
                <p className="mb-1 text-[0.7rem] font-semibold text-black/60">
                  Vælg hvilken WashWorld du vil vaske hos
                </p>
                <div
                  className={`relative rounded-[3px] border ${
                    locationError
                      ? "border-red-400 bg-red-50"
                      : "border-(--brand-green-01)/30 bg-(--brand-green-01)/5"
                  }`}
                >
                  <select
                    value={selectedLocationId}
                    onChange={(e) => { setSelectedLocationId(e.target.value); setLocationError(false); }}
                    disabled={locationsLoading}
                    className="w-full appearance-none bg-transparent py-2.5 pl-3 pr-8 text-[0.75rem] font-semibold text-black disabled:opacity-50"
                  >
                    <option value="">{locationsLoading ? "Henter lokationer…" : "-- Vælg lokation --"}</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[0.7rem] text-(--brand-green-01)">▾</span>
                </div>
                {locationError && (
                  <p className="mt-1 text-[0.7rem] font-semibold text-red-500">
                    Vælg venligst en lokation for at fortsætte
                  </p>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={handleCreateSubscription}
              className="ml-auto flex h-10.5 w-[85%] items-center justify-center bg-(--brand-green-01) text-[0.95rem] font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
            >
              {subscriptionPageNames.createButton}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
