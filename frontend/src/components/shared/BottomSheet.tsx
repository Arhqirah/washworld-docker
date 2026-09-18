// BottomSheet – et panel der glider op fra bunden af skærmen og viser valgmuligheder.
// Bruges fx til at vælge køretøj. Baggrunden mørknes og klik uden for panelet lukker det.

"use client";

import { type ReactNode } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, title, onClose, children }: BottomSheetProps) {
  return (
    <div
      className={`absolute inset-0 z-40 transition ${
        isOpen ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <button
        type="button"
        aria-label="Luk vælger"
        onClick={onClose}
        className={`absolute inset-0 bg-(--color-overlay-dark-45) transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute right-0 bottom-0 left-0 rounded-t-3xl bg-(--white-white) px-5 pt-4 pb-6 text-black shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-(--color-grey-02)" />
        <h3 className="text-[1.15rem] font-bold">{title}</h3>
        <div className="mt-4 space-y-2">{children}</div>
      </div>
    </div>
  );
}
