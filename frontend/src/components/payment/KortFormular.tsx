// Kortformular – viser inputfelter til betalingskort (kortnummer, udløb, CVC og navn).
// Håndterer automatisk formatering af kortnummer (4-cifret grupper) og udløbsdato (MM/ÅÅ).

"use client";

import { type ChangeEvent, useState } from "react";
import { CircleHelp } from "lucide-react";
import { paymentPageContent } from "@/data/payment/paymentData";

type Props = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardholderName: string;
  rememberCard: boolean;
  onCardNumberChange: (value: string) => void;
  onExpiryChange: (value: string) => void;
  onCvcChange: (value: string) => void;
  onCardholderNameChange: (value: string) => void;
  onRememberCardChange: (value: boolean) => void;
};

export default function KortFormular({
  cardNumber,
  expiry,
  cvc,
  cardholderName,
  rememberCard,
  onCardNumberChange,
  onExpiryChange,
  onCvcChange,
  onCardholderNameChange,
  onRememberCardChange,
}: Props) {
  // Styrer om CVC-hjælpeteksten er synlig
  const [showCvcHelp, setShowCvcHelp] = useState(false);

  // Fjerner alt der ikke er cifre, begrænser til 16 cifre og indsætter mellemrum hver 4. ciffer (fx "1234 5678 9012 3456")
  function handleCardNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
    onCardNumberChange(digits.replace(/(.{4})/g, "$1 ").trim());
  }

  // Indsætter automatisk skråstreg efter de første 2 cifre så formatet bliver MM/ÅÅ
  function handleExpiryChange(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
    onExpiryChange(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  }

  return (
    <div className="space-y-3">
      {/* Kortnummer */}
      <label className="block text-sm font-bold text-white">
        {paymentPageContent.card.cardNumberLabel}
      </label>
      <input
        type="text"
        inputMode="numeric"
        placeholder={paymentPageContent.card.cardNumberPlaceholder}
        value={cardNumber}
        maxLength={19}
        onChange={handleCardNumberChange}
        className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
      />

      {/* Udløbsdato og CVC side om side */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold text-white">
            {paymentPageContent.card.expiryLabel}
          </label>
          <input
            type="text"
            inputMode="numeric"
            placeholder={paymentPageContent.card.expiryPlaceholder}
            value={expiry}
            maxLength={5}
            onChange={handleExpiryChange}
            className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-white">
            {paymentPageContent.card.cvcLabel}
          </label>
          {/* CVC-felt med hjælpe-tooltip */}
          <div className="relative">
            {showCvcHelp && (
              <div className="absolute -top-20 right-0 z-10 w-48 rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(228,236,245,0.92)_100%)] px-3 py-2.5 text-xs font-semibold leading-relaxed text-slate-700 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--brand-green-01)">
                  Kortsikkerhed
                </div>
                <p>{paymentPageContent.card.cvcHelpText}</p>
                <span className="absolute -bottom-1.5 right-4 h-3 w-3 rotate-45 border-r border-b border-white/20 bg-[rgb(234,240,246)]" />
              </div>
            )}
            <input
              type="text"
              inputMode="numeric"
              placeholder={paymentPageContent.card.cvcPlaceholder}
              value={cvc}
              maxLength={4}
              onChange={(event) => onCvcChange(event.target.value.replace(/\D/g, "").slice(0, 4))}
              className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 pr-10 text-white placeholder-white/60"
            />
            <button
              type="button"
              aria-label={paymentPageContent.card.cvcHelpLabel}
              onClick={() => setShowCvcHelp((current) => !current)}
              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/90 transition active:scale-95"
            >
              <CircleHelp className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Kortholders navn */}
      <label className="block text-sm font-bold text-white">
        {paymentPageContent.card.nameLabel}
      </label>
      <input
        type="text"
        placeholder={paymentPageContent.card.namePlaceholder}
        value={cardholderName}
        onChange={(event) => onCardholderNameChange(event.target.value)}
        className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
      />

      {/* Husk kort-afkrydsningsfelt */}
      <label className="mt-1 flex items-center gap-3 rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-white">
        <input
          type="checkbox"
          checked={rememberCard}
          onChange={(event) => onRememberCardChange(event.target.checked)}
          className="h-4 w-4 rounded border-white/40 accent-(--brand-green-01)"
        />
        <span className="text-sm font-bold leading-none">
          {paymentPageContent.card.rememberCardLabel}
        </span>
      </label>
    </div>
  );
}
