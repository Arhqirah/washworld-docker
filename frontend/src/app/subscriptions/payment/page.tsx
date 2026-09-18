// SubscriptionBetalingPage – betalingsside til abonnement.
// Al tilstand og logik håndteres af useSubscriptionPayment-hooken.

"use client";

import Image from "next/image";
import { CircleHelp, CreditCard, Lock, Plus } from "lucide-react";

import PageInfo from "@/components/shared/PageInfo";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import ContinueButton from "@/components/shared/ContinueButton";
import { paymentPageContent } from "@/data/payment/paymentData";
import { subscriptionPaymentPageContent } from "@/data/subscriptions/subscriptionData";
import { useSubscriptionPayment, paymentMethods } from "@/hooks/subscriptions/useSubscriptionPayment";

export default function SubscriptionBetalingPage() {
  const {
    allLocations,
    firstPaymentAmount,
    recurringAmount,
    storedPaymentCard,
    maskedNumber,
    useNewCard,
    setUseNewCard,
    selectedPayment,
    handleSelectPayment,
    showCvcHelp,
    setShowCvcHelp,
    cardNumber,
    setCardNumber,
    expiry,
    setExpiry,
    cvc,
    setCvc,
    cardholderName,
    setCardholderName,
    rememberCard,
    setRememberCard,
    walletMethod,
    setWalletMethod,
    walletConsent,
    setWalletConsent,
    selectedWalletMethod,
    canContinue,
    handleContinue,
  } = useSubscriptionPayment();

  return (
    <div className="flex min-h-full flex-col">
      <PageInfo
        text={subscriptionPaymentPageContent.pageInfoTitle}
        userName=""
        className="bg-[linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />

      <section className="flex flex-1 flex-col px-6 pt-8 pb-6">
        <h1 className="mb-4 text-2xl font-bold text-white">
          {subscriptionPaymentPageContent.pageTitle}
        </h1>

        <div className="mb-5 rounded-lg bg-black/30 px-4 py-3 text-sm font-semibold text-white/80">
          Første betaling: <span className="font-bold text-white">{firstPaymentAmount}</span>
          <span className="mx-2 text-white/40">·</span>
          Derefter: <span className="font-bold text-white">{recurringAmount}</span>
          {allLocations && (
            <p className="mt-1 text-[11px] text-white/50">
              Inkl. adgang til alle WashWorlds (+10 kr/md.)
            </p>
          )}
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              selected={selectedPayment === method.id}
              onClick={() => handleSelectPayment(method.id)}
            />
          ))}
        </div>

        {selectedPayment !== null && (
          <div key={selectedPayment} className="payment-reveal">
            <div className="mt-6 flex items-center gap-4 text-white">
              <div className="h-1 w-20 bg-[rgba(0,19,12,0.65)]" />
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-[#7CFF45]" strokeWidth={3} />
                <span className="text-sm font-bold leading-none">
                  {paymentPageContent.secureMessage}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-lg bg-black/40 p-4">
              {selectedPayment === "card" && (
                <div className="space-y-3">
                  {storedPaymentCard && !useNewCard ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--brand-green-01)">
                          <CreditCard size={18} className="text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{maskedNumber}</p>
                          <p className="text-xs font-semibold text-white/60">
                            {storedPaymentCard.name} · Udløber {storedPaymentCard.expiry}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setUseNewCard(true)}
                        className="mt-4 flex items-center gap-1.5 text-xs font-bold text-(--brand-green-01)"
                      >
                        <Plus size={14} />
                        Brug et andet kort
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="block text-sm font-bold text-white">
                        {paymentPageContent.card.cardNumberLabel}
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder={paymentPageContent.card.cardNumberPlaceholder}
                        value={cardNumber}
                        maxLength={19}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                          setCardNumber(digits.replace(/(.{4})/g, "$1 ").trim());
                        }}
                        className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                      />
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
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                              setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                            }}
                            className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-white">
                            {paymentPageContent.card.cvcLabel}
                          </label>
                          <div className="relative">
                            {showCvcHelp && (
                              <div className="absolute -top-20 right-0 z-10 w-48 rounded-2xl border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(228,236,245,0.92)_100%)] px-3 py-2.5 text-xs font-semibold leading-relaxed text-slate-700 shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur-sm">
                                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-(--brand-green-01)">Kortsikkerhed</div>
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
                              onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                              className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 pr-10 text-white placeholder-white/60"
                            />
                            <button
                              type="button"
                              aria-label={paymentPageContent.card.cvcHelpLabel}
                              onClick={() => setShowCvcHelp((c) => !c)}
                              className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white/90 transition active:scale-95"
                            >
                              <CircleHelp className="h-5 w-5" strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <label className="block text-sm font-bold text-white">
                        {paymentPageContent.card.nameLabel}
                      </label>
                      <input
                        type="text"
                        placeholder={paymentPageContent.card.namePlaceholder}
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60"
                      />
                      <label className="mt-1 flex items-center gap-3 rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-white">
                        <input
                          type="checkbox"
                          checked={rememberCard}
                          onChange={(e) => setRememberCard(e.target.checked)}
                          className="h-4 w-4 rounded border-white/40 accent-(--brand-green-01)"
                        />
                        <span className="text-sm font-bold leading-none">
                          {paymentPageContent.card.rememberCardLabel}
                        </span>
                      </label>
                      {storedPaymentCard && (
                        <button
                          type="button"
                          onClick={() => setUseNewCard(false)}
                          className="text-xs font-bold text-white/50 underline"
                        >
                          Tilbage til gemt kort
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}

              {selectedPayment === "mobilepay" && (
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-white">
                    {paymentPageContent.mobilePay.phoneLabel}
                  </label>
                  <div className="flex gap-2">
                    <input type="text" placeholder={paymentPageContent.mobilePay.countryCodePlaceholder} className="w-16 rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60" />
                    <input type="text" placeholder={paymentPageContent.mobilePay.phonePlaceholder} className="flex-1 rounded border border-white/30 bg-white/10 px-3 py-2 text-white placeholder-white/60" />
                  </div>
                  <div className="flex items-start gap-3 rounded bg-[#4a52a8] px-4 py-3 text-white">
                    <p className="text-xs font-semibold leading-relaxed">{paymentPageContent.mobilePay.infoText}</p>
                  </div>
                </div>
              )}

              {selectedPayment === "wallet" && (
                <div className="rounded-md bg-white/8 p-3">
                  <h3 className="mb-2 text-xl font-bold text-white">{paymentPageContent.wallet.title}</h3>
                  <p className="mb-3 text-[11px] font-semibold leading-tight text-white/80">{paymentPageContent.wallet.description}</p>
                  <label className="mb-1 block text-xs font-bold text-white">
                    {paymentPageContent.wallet.methodLabel}
                  </label>
                  <div className="relative mb-3">
                    <select
                      value={walletMethod}
                      onChange={(e) => setWalletMethod(e.target.value as "apple" | "google")}
                      className="h-10 w-full appearance-none rounded border border-white/25 bg-white/8 px-2.5 pr-8 text-base font-bold text-white"
                    >
                      {paymentPageContent.wallet.methods.map((m) => (
                        <option key={m.value} value={m.value} className="text-black">{m.label}</option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg font-bold text-white">▾</span>
                  </div>
                  <label className="mb-1 block text-xs font-bold text-white">
                    {paymentPageContent.wallet.amountLabel}
                  </label>
                  <div className="mb-1 flex h-10 items-center justify-end rounded border border-white/25 bg-white/8 px-3">
                    <span className="text-[30px] font-bold text-(--brand-green-01)">{firstPaymentAmount}</span>
                  </div>
                  <p className="mb-3 text-right text-[10px] font-semibold text-white/60">
                    Derefter {recurringAmount}
                  </p>
                  <label className="mb-3 flex cursor-pointer items-start gap-2.5 rounded-lg border border-white/12 bg-white/6 px-3 py-2.5 text-white">
                    <input
                      type="checkbox"
                      checked={walletConsent}
                      onChange={(e) => setWalletConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/40 accent-(--brand-green-01)"
                    />
                    <span className="text-[10px] font-semibold leading-tight text-white/70">
                      {paymentPageContent.wallet.consentText}
                    </span>
                  </label>
                  <button type="button" className="flex h-10 w-full items-center justify-center overflow-hidden rounded border border-sky-500 bg-white px-3 text-lg font-bold text-black">
                    {selectedWalletMethod && (
                      <Image src={selectedWalletMethod.logo} alt={selectedWalletMethod.label} width={260} height={260} className={selectedWalletMethod.imageClassName} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pb-5 pt-4">
          <ContinueButton onClick={handleContinue} disabled={!canContinue}>
            {subscriptionPaymentPageContent.buttons.continue}
          </ContinueButton>
        </div>
      </section>
    </div>
  );
}
