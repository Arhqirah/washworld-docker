// SingleWashPage – valg af vaskeprogram (Guld / Premium / Brilliant) til en enkelt vask.
// Brugeren ser en animeret kortvisning for hvert program med priser og indhold.
// Valg gemmes som URL-parameter og sendes videre til betalingssiden.
//
// Hooks der bruges:
//   usePlanCarousel() → styrer planvalg, animationsretning og animKey (hooks/usePlanCarousel.ts)
//
// Komponenter der bruges:
//   PageInfo    → sidetitel øverst
//   PlanFeature → viser én feature/fordel på plankortet (components/PlanFeature.tsx)
//
// Slide-animationerne (.slide-right / .slide-left) er defineret i globals.css.
// plate, carId, locationId og equipmentId sendes videre som URL-parametre til payments/page.tsx.

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import PageInfo from "@/components/shared/PageInfo";
import { PlanFeature } from "@/components/wash/PlanFeature";
import { singleWashPageContent, paymentPlans } from "@/data/wash/singleWashData";
import { ROUTES } from "@/lib/routes";
import { usePlanCarousel } from "@/hooks";

const PLANS = ["Guld", "Premium", "Brilliant"];

export default function SingleWashPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const plate = searchParams.get("plate") ?? undefined;
  const carId = searchParams.get("carId") ?? undefined;
  const locationId = searchParams.get("location") ?? undefined;
  const equipmentId = searchParams.get("equipment") ?? undefined;

  const { selectedIndex, slideDirection, animKey, selectPlan } = usePlanCarousel();
  const currentPlan = paymentPlans[selectedIndex];

  function handleContinue() {
    router.push(ROUTES.payment(currentPlan.slug, plate, carId, locationId, equipmentId));
  }

  return (
    <div className="min-h-full flex flex-col">
      <PageInfo text={singleWashPageContent.pageInfoTitle} userName="" />

      <section className="flex flex-1 flex-col px-7 pt-6 pb-6 text-center text-white">
        <h2 className="text-[1.9rem] font-bold leading-tight">
          {singleWashPageContent.pageTitleLineOne}
          <br />
          {singleWashPageContent.pageTitleLineTwo}
        </h2>

        <p className="mx-auto mt-5 max-w-67.5 text-[0.9rem] font-bold leading-tight">
          {singleWashPageContent.description}
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
              <p className="mt-2 text-[1.35rem] font-bold">{currentPlan.price} / vask</p>
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

            <button
              type="button"
              onClick={handleContinue}
              className="ml-auto flex h-10.5 w-[85%] items-center justify-center bg-(--brand-green-01) text-[0.95rem] font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
            >
              {singleWashPageContent.buttons.continue}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
