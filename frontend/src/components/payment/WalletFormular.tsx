// WalletFormular – viser valgmuligheder for Apple Pay / Google Pay.
// Brugeren vælger wallet-metode, bekræfter beløb og accepterer samtykke.

"use client";

import Image from "next/image";
import { paymentPageContent } from "@/data/payment/paymentData";

type Props = {
  walletMethod: "apple" | "google";
  selectedPlanAmount: string;
  walletConsent: boolean;
  onWalletMethodChange: (value: "apple" | "google") => void;
  onWalletConsentChange: (value: boolean) => void;
};

export default function WalletFormular({
  walletMethod,
  selectedPlanAmount,
  walletConsent,
  onWalletMethodChange,
  onWalletConsentChange,
}: Props) {
  // Slår det valgte wallet-objekt op så vi kan vise det rigtige logo og label på knappen
  const selectedMethod = paymentPageContent.wallet.methods.find(
    (method) => method.value === walletMethod,
  );

  return (
    <div className="rounded-md bg-white/8 p-3">
      <h3 className="mb-2 text-xl font-bold text-white">
        {paymentPageContent.wallet.title}
      </h3>

      <p className="mb-3 text-[11px] font-semibold leading-tight text-white/80">
        {paymentPageContent.wallet.description}
      </p>

      {/* Vælg wallet-type (Apple Pay eller Google Pay) */}
      <label htmlFor="wallet-method" className="mb-1 block text-xs font-bold text-white">
        {paymentPageContent.wallet.methodLabel}
      </label>
      <div className="relative mb-3">
        <select
          id="wallet-method"
          value={walletMethod}
          onChange={(event) => onWalletMethodChange(event.target.value as "apple" | "google")}
          className="h-10 w-full appearance-none rounded border border-white/25 bg-white/8 px-2.5 pr-8 text-base font-bold text-white"
        >
          {paymentPageContent.wallet.methods.map((method) => (
            <option key={method.value} value={method.value} className="text-black">
              {method.label}
            </option>
          ))}
        </select>
        {/* Brugerdefineret pil-ikon – nødvendigt fordi appearance-none skjuler den native dropdown-pil */}
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg font-bold text-white">
          ▾
        </span>
      </div>

      {/* Beløb der trækkes */}
      <label className="mb-1 block text-xs font-bold text-white">
        {paymentPageContent.wallet.amountLabel}
      </label>
      <div className="mb-3 flex h-10 items-center justify-end rounded border border-white/25 bg-white/8 px-3">
        <span className="text-[30px] font-bold text-(--brand-green-01)">
          {selectedPlanAmount}
        </span>
      </div>

      {/* Samtykke-afkrydsningsfelt */}
      <label className="mb-3 flex cursor-pointer items-start gap-2.5 rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-white">
        <input
          type="checkbox"
          checked={walletConsent}
          onChange={(event) => onWalletConsentChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/40 accent-(--brand-green-01)"
        />
        <span className="text-[10px] font-semibold leading-tight text-white/70">
          {paymentPageContent.wallet.consentText}
        </span>
      </label>

      {/* Betal-knap med wallet-logo */}
      <button
        type="button"
        className="flex h-10 w-full items-center justify-center overflow-hidden rounded border border-sky-500 bg-white px-3 text-lg font-bold text-black"
      >
        {selectedMethod && (
          <Image
            src={selectedMethod.logo}
            alt={selectedMethod.label}
            width={260}
            height={260}
            className={selectedMethod.imageClassName}
          />
        )}
      </button>
    </div>
  );
}
