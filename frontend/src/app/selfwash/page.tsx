// ActiveWashPage (Selvvask/Støvsuger) – aktiv session til selvvask eller støvsuger.
// Viser en timer og en løbende pris (6 kr/min). Brugeren afslutter manuelt med en knap.
// Ved afslutning gemmes en wash_log-post i databasen og brugeren sendes til forsiden.

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AssistanceButton, Button } from "@/components/buttons";
import { CompletionModal } from "@/components/activewash/CompletionModal";
import { createWashLog } from "@/lib/washLogApi";
import { ROUTES } from "@/lib/routes";

const PRICE_PER_MINUTE = 6;
const SESSION_ID = 1043;

// Product IDs matching the database
const PRODUCT_ID_VASK_SELV = "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1";
const PRODUCT_ID_STOEVSUGER = "e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2";

export default function ActiveWashPage() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get("carId") ?? "";
  const locationParam = searchParams.get("location") ?? "";
  const equipment = searchParams.get("equipment") ?? "";
  const equipmentId = equipment.split("-").pop() ?? SESSION_ID;
  const washLogCreated = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => setTotalSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const secsIntoMin = totalSeconds % 60;
  const secsUntilNext = secsIntoMin === 0 ? 60 : 60 - secsIntoMin;
  const currentPrice = (minutes + 1) * PRICE_PER_MINUTE;
  const progressPercent = (secsIntoMin / 60) * 100;

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex h-full flex-col">

      {/* Assistance button */}
      <div className="flex justify-center px-8 pt-8">
        <AssistanceButton />
      </div>

      {/* Session info */}
      <div className="mt-5 flex flex-col items-center gap-1 px-8">
        <p className="text-sm text-(--white-white)/60">ID : {equipmentId}</p>
        <p className="text-sm font-bold text-(--white-white)">
          {PRICE_PER_MINUTE} kr / min
        </p>
        <p className="mt-2 text-2xl font-bold text-(--white-white)">
          Vasken er i gang.
        </p>
      </div>

      {/* Timer */}
      <p
        className="mt-6 text-center font-bold tabular-nums text-(--white-white)"
        style={{ fontSize: "clamp(64px, 20vw, 88px)", lineHeight: 1 }}
        aria-live="polite"
        aria-label={`Tid: ${pad(minutes)} minutter og ${pad(seconds)} sekunder`}
      >
        {pad(minutes)}:{pad(seconds)}
      </p>

      {/* Divider */}
      <div className="mx-8 mt-8 border-t border-(--color-grey-02)" />

      {/* Price */}
      <div className="mt-6 flex flex-col items-center gap-1 px-8">
        <p className="text-base text-(--white-white)/60">Nuværende pris</p>
        <p className="text-4xl font-bold text-(--white-white)">{currentPrice} kr</p>
      </div>

      {/* Next increase + progress bar */}
      <div className="mt-3 flex flex-col items-center gap-2 px-8">
        <p className="text-sm text-(--white-white)/60">
          {totalSeconds > 0 && secsIntoMin === 0
            ? "Prisen steg netop nu!"
            : `næste stigning om ${secsUntilNext} sek`}
        </p>

        <div className="h-1 w-full overflow-hidden rounded-full bg-(--color-grey-02)">
          <div
            className="h-full rounded-full bg-(--color-primary) transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* End wash button */}
      <div className="mt-8 flex justify-center px-8">
        <Button
          variant="primary"
          size="lg"
          onClick={() => {
            if (carId && !washLogCreated.current) {
              washLogCreated.current = true;
              const productId = equipment.startsWith("stovsuger")
                ? PRODUCT_ID_STOEVSUGER
                : PRODUCT_ID_VASK_SELV;
              createWashLog({
                car_id: carId,
                product_id: productId,
                location_id: locationParam || undefined,
                wash_log_price: currentPrice,
              }).catch(() => {});
            }
            setTimeout(() => setShowModal(true), 800);
          }}
        >
          Afslut vask
        </Button>
      </div>

      {showModal && (
        <CompletionModal
          onClose={() => router.push(ROUTES.dashboard)}
          onReceipt={() => router.push(ROUTES.washHistory)}
        />
      )}
    </div>
  );
}