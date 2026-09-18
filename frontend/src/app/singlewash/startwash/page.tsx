// SingleWashStartPage – klargøringssiden inden vasken begynder.
// Viser en bil-animation og en stor Start Vask-knap.
// Understøtter både enkelt vask (plan + betaling) og abonnements-vask.

"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import PageInfo from "@/components/shared/PageInfo";
import SingleWashAdviceInfo from "../../../components/wash/SingleWashAdviceInfo";
import StartWashButton from "@/components/buttons/StartWashButton";
import { singleWashReadyPageContent } from "@/data/wash/singleWashData";
import { ROUTES } from "@/lib/routes";

export default function SingleWashStartPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isSubscription = searchParams.get("subscription") === "true";
  const selectedPlan = searchParams.get("plan") ?? "guld";
  const selectedPayment = searchParams.get("payment") ?? "card";
  const plateNumber = searchParams.get("plate") ?? "";
  const carId = searchParams.get("carId") ?? undefined;
  const locationId = searchParams.get("location") ?? undefined;
  const equipmentId = searchParams.get("equipment") ?? undefined;
  const pageTitle = singleWashReadyPageContent.title.replace(/\.\.\.$/, "");

  function handleStartWash() {
    if (isSubscription) {
      router.push(ROUTES.activeWashSubscription(locationId ?? "", equipmentId ?? "", carId));
    } else {
      router.push(ROUTES.activeWash(selectedPlan, selectedPayment, plateNumber, carId, locationId, equipmentId));
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageInfo
        text={singleWashReadyPageContent.pageInfoTitle}
        userName=""
        className=""
      />

      <section className="relative flex flex-1 flex-col px-7 pt-8 pb-24 text-white">
        <h1 className="mx-auto mt-20 max-w-66 text-[2.1rem] font-bold leading-tight">
          {pageTitle}
        </h1>

        <div className="mx-auto mt-13 w-full max-w-76">
          <div className="driving-scene relative h-44 overflow-hidden px-2 py-6">
            <div className="driving-car-wrap relative z-10 mx-auto mt-2 w-fit">
              <div className="driving-car-shadow absolute inset-x-7 bottom-3 h-5 rounded-full" />
              <Image
                src="/icons/drivingCar.png"
                alt={singleWashReadyPageContent.illustrationAlt}
                width={214}
                height={123}
                className="driving-car-image h-auto w-52 object-contain"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col items-center pt-14 text-center">
          <div className="flex items-center justify-center gap-2">
            <p className="text-[1rem] font-bold text-white">
              {singleWashReadyPageContent.ctaLabel}
            </p>
            <SingleWashAdviceInfo />
          </div>

          <div className="mt-3 flex w-full justify-center">
            <StartWashButton onClick={handleStartWash} />
          </div>
        </div>
      </section>
    </div>
  );
}
