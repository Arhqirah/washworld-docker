// SingleWashPlatePage – nummerpladeregistrering til enkelt vask.
// Viser en scanning-animation og lader brugeren bekræfte eller manuelt indtaste nummerplade.
// Nummerplade sendes videre som URL-parameter til startvask-siden.

"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import PageInfo from "@/components/shared/PageInfo";
import SingleWashAdviceInfo from "../../../components/wash/SingleWashAdviceInfo";
import ContinueButton from "@/components/shared/ContinueButton";
import { singleWashPlatePageContent } from "@/data/wash/singleWashData";
import { ROUTES } from "@/lib/routes";

export default function SingleWashPlatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefilledPlate = searchParams.get("plate") ?? "";
  const [plateNumber, setPlateNumber] = useState(prefilledPlate || "DB 43 234");

  const selectedPlan = searchParams.get("plan") ?? "guld";
  const selectedPayment = searchParams.get("payment") ?? "card";
  const carId = searchParams.get("carId") ?? undefined;
  const scanningTitle = singleWashPlatePageContent.title.replace(/\.\.\.$/, "");

  function handleContinue() {
    router.push(ROUTES.startWash(selectedPlan, selectedPayment, plateNumber, carId));
  }

  return (
    <div className="min-h-full flex flex-col">
      <PageInfo
        text={singleWashPlatePageContent.pageInfoTitle}
        userName=""
        className=""
      />

      <section className="relative flex flex-1 flex-col px-7 pt-8 pb-5 text-white">
          <h1
            className="mt-20 text-center text-[2.1rem] font-bold leading-tight"
            aria-label={singleWashPlatePageContent.title}
          >
            {scanningTitle}
            <span className="inline-flex w-[1.2em] justify-start text-left">
              <span className="scanning-dot">.</span>
              <span className="scanning-dot">.</span>
              <span className="scanning-dot">.</span>
            </span>
          </h1>

          <div className="mx-auto mt-10 w-full max-w-93">
            <Image
              src="/icons/ScanningPlate.png"
              alt={singleWashPlatePageContent.illustrationAlt}
              width={372}
              height={245}
              className="h-auto w-full object-contain"
              priority
            />
          </div>

          <div className="mx-auto mt-12 w-full max-w-81.5">
            <div className="mb-2 flex items-center justify-center gap-2">
              <label className="text-[1.1rem] font-bold text-white">
                {singleWashPlatePageContent.manualLabel}
              </label>
              <SingleWashAdviceInfo />
            </div>

            <input
              type="text"
              value={plateNumber}
              onChange={(event) =>
                setPlateNumber(event.target.value.toUpperCase())
              }
              placeholder={singleWashPlatePageContent.manualPlaceholder}
              className="h-14 w-full border-[3px] border-white bg-[#d9ddda]/85 px-4 text-[1.05rem] font-bold uppercase tracking-[0.02em] text-[#8d9892] outline-none placeholder:text-[#8d9892]"
            />
          </div>

          <div className="mt-auto pt-12">
            <ContinueButton onClick={handleContinue} disabled={!plateNumber.trim()}>
              {singleWashPlatePageContent.buttons.continue}
            </ContinueButton>
          </div>
        </section>
    </div>
  );
}
