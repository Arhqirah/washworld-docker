// AssistanceButton – rød HJÆLP-knap til aktive vasker.
// showPopup: styrer om bekræftelsesdialogen er synlig (true) eller skjult (false).
// Returnerer knappen plus en modal-popup der spørger brugeren om de vil ringe
// til WashWorld support. Klikkes der på baggrunden lukkes popuppen automatisk.

"use client";

import { useState } from "react";
import { Phone, X } from "lucide-react";

interface AssistanceButtonProps {
  iconColor?: string;
  washId?: string | number;
}

export default function AssistanceButton({ iconColor = "white", washId }: AssistanceButtonProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPopup(true)}
        className="flex h-11.75 w-full max-w-143.75 items-center justify-center gap-4 rounded-[3px] bg-(--color-danger) px-8"
      >
        <span className="text-xl font-bold tracking-widest text-white">
          HJÆLP
        </span>
        <Phone size={22} color={iconColor} strokeWidth={2.5} />
      </button>

      {showPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="relative mx-5 w-full max-w-sm rounded-[3px] bg-white px-6 py-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-600"
              aria-label="Luk"
            >
              <X size={20} />
            </button>

            <div className="mb-5 flex flex-col items-center gap-2 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Phone size={22} className="text-(--color-danger)" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">Ring til hjælp?</h2>
              <p className="text-sm text-neutral-500">
                Du er ved at ringe til WashWorld support
              </p>
              {washId && (
                <span className="mt-1 rounded-[3px] bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
                  ID: {washId}
                </span>
              )}
            </div>

            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="flex flex-1 h-12 items-center justify-center rounded-[3px] bg-neutral-500 font-bold text-white text-sm"
              >
                Annuller
              </button>
              <a
                href="tel:+4570707070"
                className="flex flex-1 h-12 items-center justify-center rounded-[3px] bg-(--color-danger) font-bold text-white text-sm"
              >
                Ring til hjælp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
