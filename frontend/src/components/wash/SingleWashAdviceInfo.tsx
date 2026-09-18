// SingleWashAdviceInfo – info-knap der åbner et modalt slideshow med råd om klargøring inden enkelt vask.
// Viser billeder og tekst trin for trin (fx "Fold spejle ind", "Åbn antenne") og lukkes med X eller "Luk"-knappen.

"use client";

import Image from "next/image";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";

import { singleWashAdviceContent } from "@/data/wash/singleWashData";

export default function SingleWashAdviceInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalRoot] = useState<HTMLElement | null>(
    () => typeof document !== "undefined" ? document.querySelector<HTMLElement>(".app-screen") : null,
  );

  const activeItem = singleWashAdviceContent.items[activeIndex];
  const isLastItem = activeIndex === singleWashAdviceContent.items.length - 1;

  // Lukker modalen og nulstiller til første trin så næste åbning starter forfra.
  function handleClose() {
    setIsOpen(false);
    setActiveIndex(0);
  }

  // Går til næste råd, eller lukker modalen hvis det er det sidste råd.
  function handleContinue() {
    if (isLastItem) {
      handleClose();
      return;
    }

    setActiveIndex((current) => current + 1);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={singleWashAdviceContent.openLabel}
        className="text-black transition active:scale-95"
      >
        <Info size={20} />
      </button>

      {isOpen && modalRoot
        ? createPortal(
            <>
              <div
                className="wash-advice-backdrop absolute inset-0 z-40 bg-black/55"
                onClick={handleClose}
              />

              <div className="absolute inset-0 z-50 flex items-center justify-center px-5">
                <div
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="wash-advice-title"
                  className="wash-advice-card relative w-full max-w-85 rounded-3xl bg-white px-5 pt-3 pb-5 text-center text-black shadow-[0_24px_64px_rgba(0,0,0,0.25)]"
                >
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label={singleWashAdviceContent.closeLabel}
                    className="absolute right-3 top-3 text-[#ff5b31] transition active:scale-95"
                  >
                    <X className="h-6 w-6" strokeWidth={2.75} />
                  </button>

                  <div className="space-y-0.5 pt-1">
                    <h2
                      id="wash-advice-title"
                      className="text-[1.05rem] font-bold leading-none"
                    >
                      {singleWashAdviceContent.title}
                    </h2>
                    <p className="text-[1rem] font-bold leading-none">
                      {singleWashAdviceContent.rememberLabel}
                    </p>
                  </div>

                  <div className="relative mx-auto mt-3 w-full max-w-45 border-2 border-black/55 bg-white">
                    <Image
                      src={activeItem.image}
                      alt={activeItem.alt}
                      width={180}
                      height={104}
                      className="h-auto w-full object-cover"
                      priority
                    />
                  </div>

                  <p className="mt-3 text-[0.95rem] font-bold leading-tight">
                    {activeItem.title}
                  </p>

                  <div className="mt-5 flex justify-center">
                    <button
                      type="button"
                      onClick={handleContinue}
                      className="min-w-31 bg-(--brand-green-01) px-6 py-1.5 text-[1.05rem] font-bold text-white shadow-[0_6px_12px_rgba(0,0,0,0.16)] [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
                    >
                      {isLastItem
                        ? singleWashAdviceContent.closeLabel
                        : singleWashAdviceContent.continueLabel}
                    </button>
                  </div>
                </div>
              </div>
            </>,
            modalRoot,
          )
        : null}
    </>
  );
}
