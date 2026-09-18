// CarPickerSheet – bundpanel til valg af køretøj inden en vask startes.
// Viser alle brugerens biler med nummerplade og om de har et aktivt abonnement eller ej.

"use client";

import Link from "next/link";
import BottomSheet from "@/components/shared/BottomSheet";
import type { Car, Subscription } from "@/types/api";

interface CarPickerSheetProps {
  isOpen: boolean;
  cars: Car[];
  subscriptions: Subscription[];
  onSelect: (car: Car) => void;
  onClose: () => void;
  returnTo?: string;
}

export default function CarPickerSheet({
  isOpen,
  cars,
  subscriptions,
  onSelect,
  onClose,
  returnTo,
}: CarPickerSheetProps) {
  const addCarHref = returnTo
    ? `/cars/add?returnTo=${encodeURIComponent(returnTo)}`
    : "/cars/add";

  return (
    <BottomSheet isOpen={isOpen} title="Vælg køretøj" onClose={onClose}>
      {cars.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <p className="text-sm text-neutral-500">Du har ingen biler tilknyttet din konto.</p>
          <Link
            href={addCarHref}
            className="rounded-[3px] bg-(--color-primary) px-5 py-2 text-sm font-semibold text-white active:opacity-80"
          >
            Tilføj bil
          </Link>
        </div>
      ) : (
        cars.map((car) => {
          const hasSub = subscriptions.some(
            (s) => s.car_id === car.car_id && s.subscriptions_status === "aktiv",
          );
          return (
            <button
              key={car.car_id}
              type="button"
              onClick={() => onSelect(car)}
              className="flex w-full items-center gap-3 rounded-xl border border-(--color-grey-02) bg-(--color-surface) px-4 py-3 text-left active:bg-neutral-100"
            >
              <LicensePlate plate={car.car_license_plate} />
              {car.car_name && (
                <span className="flex-1 truncate text-sm font-semibold text-neutral-600">
                  {car.car_name}
                </span>
              )}
              <span
                className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  hasSub ? "bg-emerald-400 text-emerald-900" : "bg-neutral-300 text-neutral-600"
                }`}
              >
                {hasSub ? "Abonnement" : "Enkelt vask"}
              </span>
            </button>
          );
        })
      )}
    </BottomSheet>
  );
}

// Viser en nummerplade med blå EU-søjle til venstre, ligesom et rigtigt dansk skilt.
function LicensePlate({ plate }: { plate: string }) {
  return (
    <div className="flex h-8 shrink-0 overflow-hidden border-2 border-neutral-800 bg-white text-neutral-950">
      <span className="flex w-5 items-center justify-center bg-[#327fc2]" />
      <span className="flex items-center px-2.5 text-[13px] font-bold tracking-[0.08em]">
        {plate}
      </span>
    </div>
  );
}
