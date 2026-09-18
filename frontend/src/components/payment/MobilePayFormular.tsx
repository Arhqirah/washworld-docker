// MobilePayFormular – viser telefonnummer-input og betal-knap til MobilePay.
// Landekode og nummer er adskilt, og nummeret formateres automatisk med mellemrum.

"use client";

import { type ChangeEvent } from "react";
import Image from "next/image";
import { CircleAlert } from "lucide-react";
import { paymentPageContent } from "@/data/payment/paymentData";

type Props = {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (value: string) => void;
  onPhoneNumberChange: (value: string) => void;
};

export default function MobilePayFormular({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
}: Props) {
  // Tillader kun cifre og '+', og sikrer at landekoden altid starter med '+'
  function handleCountryCodeChange(event: ChangeEvent<HTMLInputElement>) {
    const raw = event.target.value.replace(/[^\d+]/g, "");
    onCountryCodeChange(raw.startsWith("+") ? raw : "+" + raw.replace(/\+/g, ""));
  }

  // Begrænser til 8 cifre og formaterer som par adskilt af mellemrum (fx "12 34 56 78")
  function handlePhoneNumberChange(event: ChangeEvent<HTMLInputElement>) {
    const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
    onPhoneNumberChange(digits.replace(/(\d{2})(?=\d)/g, "$1 ").trim());
  }

  return (
    <div className="space-y-3">
      {/* Telefonnummer-input (landekode + nummer) */}
      <label className="block text-sm font-bold text-white">
        {paymentPageContent.mobilePay.phoneLabel}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          inputMode="tel"
          placeholder={paymentPageContent.mobilePay.countryCodePlaceholder}
          value={countryCode}
          maxLength={4}
          onChange={handleCountryCodeChange}
          className="w-16 rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
        />
        <input
          type="text"
          inputMode="tel"
          placeholder={paymentPageContent.mobilePay.phonePlaceholder}
          value={phoneNumber}
          maxLength={11}
          onChange={handlePhoneNumberChange}
          className="flex-1 rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
        />
      </div>

      {/* Informationsboks om MobilePay-godkendelse */}
      <div className="flex items-start gap-3 rounded bg-[#4a52a8] px-4 py-3 text-white">
        <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-sky-300" strokeWidth={2.5} />
        <p className="text-xs font-semibold leading-relaxed">
          {paymentPageContent.mobilePay.infoText}
        </p>
      </div>

      {/* Betal med MobilePay-knap */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
      >
        <Image
          src={paymentPageContent.mobilePay.payButtonIcon}
          alt="MobilePay"
          width={22}
          height={22}
          className="h-5 w-5 object-contain"
        />
        {paymentPageContent.mobilePay.payButton}
      </button>
    </div>
  );
}
