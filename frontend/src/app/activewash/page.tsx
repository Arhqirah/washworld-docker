// ActiveAutoWashPage – aktiv automatisk vask (vaskehal).
// Viser en animeret bil der gennemgår faserne: forbereder → sæbe → skyl → tørring → færdig.
// Fremgangen kører automatisk med en timer. Når vasken er færdig vises CompletionModal.
// En wash_log-post gemmes i databasen én gang når fremgangen rammer 100%.
//
// Komponenter der bruges:
//   CarIllustration  → animeret bil-illustration der skifter udseende per fase (components/activewash/)
//   CompletionModal  → pop-up når vasken er færdig med knapper til kvittering og dashboard (components/activewash/)
//   AssistanceButton → hjælpeknap med wash-id øverst på siden
//
// URL-parametre der læses:
//   plan        → planslug (fx "guld") til at slå pris op i paymentPlans
//   payment     → betalingsmetode ("card" / "mobilepay" / "wallet")
//   plate       → nummerplade til receipten
//   carId       → bilens id til wash_log-oprettelse
//   subscription → "true" hvis det er en abonnementsvask (ingen product_id på wash_log)
//   location    → lokations-id til wash_log
//   equipment   → udstyrsstrengen, fx "vaskehal-42" (sidst segment bruges som displayId)

"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AssistanceButton } from "@/components/buttons";
import { CarIllustration, type WashStage } from "@/components/activewash/CarIllustration";
import { CompletionModal } from "@/components/activewash/CompletionModal";
import { saveLatestSingleWashReceipt } from "@/data/receipts/receiptHistory";
import { paymentPlans } from "@/data/wash/singleWashData";
import { subscriptionPlans } from "@/data/subscriptions/subscriptionData";
import { createWashLog } from "@/lib/washLogApi";
import { ROUTES } from "@/lib/routes";

const SESSION_ID = 1042;

function getStage(p: number): WashStage {
  if (p < 10) return "forbereder";
  if (p < 40) return "sæbe";
  if (p < 70) return "skyl";
  if (p < 90) return "tørring";
  return "færdig";
}

const STAGE_LABEL: Record<WashStage, string> = {
  forbereder: "Vasken forberedes… sæt dig godt\ntil rette og nyd din pause.",
  sæbe:       "Vasken er i gang, sæt dig godt\ntil rette og nyd din pause.",
  skyl:       "Skylning er i gang – næsten\nhelt ren!",
  tørring:    "Tørring er i gang, snart\nklar til afhentning.",
  færdig:     "Din bil er ren og klar!\nVelkommen tilbage.",
};

interface ActiveAutoWashPageProps {
  progress?: number;
  washId?: string | number;
}

export default function ActiveAutoWashPage({
  progress: externalProgress,
  washId = SESSION_ID,
}: ActiveAutoWashPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedPlanSlug = searchParams.get("plan") ?? "";
  const selectedPayment  = searchParams.get("payment") ?? "card";
  const plate            = searchParams.get("plate") ?? "DB 43 234";
  const carId            = searchParams.get("carId") ?? "";
  const isSubscription   = searchParams.get("subscription") === "true";
  const locationParam    = searchParams.get("location") ?? "";
  const equipmentParam   = searchParams.get("equipment") ?? "";

  const equipmentId = equipmentParam.split("-").pop();
  const displayId   = equipmentId ?? SESSION_ID;

  const selectedPlan = paymentPlans.find((plan) => plan.slug === selectedPlanSlug);

  const [internalProgress, setInternalProgress] = useState(0);
  const progress = externalProgress ?? internalProgress;
  const [showModal, setShowModal]         = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const washLogCreated = useRef(false);

  // Automatisk progress-timer – stopper præcist på 100 så modal-effekten kan aktivere
  useEffect(() => {
    if (externalProgress !== undefined) return;
    let p = 0;
    const iv = setInterval(() => {
      p += 0.35;
      if (p >= 100) {
        setInternalProgress(100);
        clearInterval(iv);
        return;
      }
      setInternalProgress(p);
    }, 60);
    return () => clearInterval(iv);
  }, [externalProgress]);

  // Vis modal 800ms efter progress rammer 100
  useEffect(() => {
    if (progress >= 100 && !modalDismissed) {
      const t = setTimeout(() => setShowModal(true), 800);
      return () => clearTimeout(t);
    }
  }, [progress, modalDismissed]);

  // Gem wash_log én gang når vasken er færdig – washLogCreated.current forhindrer duplikater
  useEffect(() => {
    if (progress < 100 || washLogCreated.current || !carId) return;
    washLogCreated.current = true;
    const productId = isSubscription
      ? undefined
      : subscriptionPlans.find((p) => p.slug === selectedPlanSlug)?.productId;
    createWashLog({
      car_id: carId,
      product_id: productId,
      location_id: locationParam || undefined,
    }).catch(() => {});
  }, [progress, carId, isSubscription, locationParam, selectedPlanSlug]);

  // Gem lokal kvittering til receipts-siden
  useEffect(() => {
    if (!selectedPlan) return;
    const paymentLabel: Record<string, string> = {
      card: "Kortbetaling", mobilepay: "MobilePay", wallet: "Wallet",
    };
    saveLatestSingleWashReceipt({
      planName: selectedPlan.name,
      price:    selectedPlan.price,
      plate,
      payment:  paymentLabel[selectedPayment] ?? "Kortbetaling",
    });
  }, [plate, selectedPayment, selectedPlan]);

  const stage = getStage(progress);

  function handleClose() {
    setShowModal(false);
    setModalDismissed(true);
    router.push(ROUTES.dashboard);
  }

  function handleReceipt() {
    setShowModal(false);
    router.push(ROUTES.washHistory);
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex flex-1 min-h-0 flex-col justify-around px-8 py-6 pb-24">
        <div className="flex flex-col items-center justify-center">
          <AssistanceButton washId={displayId} />
          <p className="p-3 text-sm text-(--white-white)/60">ID : {displayId}</p>
        </div>

        <div className="px-2">
          <CarIllustration stage={stage} progress={progress} />
        </div>

        <p className="whitespace-pre-line px-2 text-center text-base text-(--white-white)" aria-live="polite">
          {STAGE_LABEL[stage]}
        </p>

        {/* Fremgangsbjælke */}
        <div>
          <div className="h-6 w-full overflow-hidden bg-(--color-grey-02)">
            <div
              className="h-full bg-(--color-primary) transition-all duration-300 ease-linear"
              style={{ width: `${Math.max(1, progress)}%` }}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <CompletionModal onClose={handleClose} onReceipt={handleReceipt} />
      )}
    </div>
  );
}
