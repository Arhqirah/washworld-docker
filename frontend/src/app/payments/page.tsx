// BetalingPage – betalingsside til enkelt vask og gem-kort-funktion.
// Brugeren vælger betalingsmetode og gennemfører betaling for en enkelt vask.
// Kan også bruges alene til at gemme et betalingskort (via ?saveCard=true).

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import PageInfo from "@/components/shared/PageInfo";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import ContinueButton from "@/components/shared/ContinueButton";
import KortFormular from "@/components/payment/KortFormular";
import MobilePayFormular from "@/components/payment/MobilePayFormular";
import WalletFormular from "@/components/payment/WalletFormular";
import { paymentOptions, paymentPageContent } from "@/data/payment/paymentData";
import { paymentPlans } from "@/data/wash/singleWashData";
import { SAVED_PAYMENT_CARD_STORAGE_KEY } from "@/data/profile/profileData";
import { ROUTES } from "@/lib/routes";

// ─── Typer ────────────────────────────────────────────────────────────────────

type GemtBetalingskort = {
  cardNumber: string;
  expiry: string;
  name: string;
};

// ─── Hjælpefunktioner ─────────────────────────────────────────────────────────

/** Henter et gemt betalingskort fra localStorage, eller null hvis intet findes. */
function hentGemtBetalingskort(): GemtBetalingskort | null {
  if (typeof window === "undefined") return null;

  const rawValue = window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    return JSON.parse(rawValue) as GemtBetalingskort;
  } catch {
    // Ugyldigt JSON – ryd op og returner null
    window.localStorage.removeItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
    return null;
  }
}

/** Oversætter en betalingsmetodes titel til et internt id. */
function getBetalingsId(title: string): string {
  const normalized = title.toLowerCase();
  if (normalized.includes("mobilepay")) return "mobilepay";
  if (normalized.includes("wallet") || normalized.includes("apple pay")) return "wallet";
  if (normalized.includes("kontakt")) return "contactless";
  return "card";
}

// Byg listen af betalingsmetoder fra konfigurationen i paymentData
const betalingsmetoder = paymentOptions.map((option, index) => ({
  id: getBetalingsId(option.title),
  title: option.title,
  description: option.description,
  image: option.icon || `/payment/${index}.png`,
}));

// ─── Side ─────────────────────────────────────────────────────────────────────

export default function BetalingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL-parametre
  const saveCardOnly = searchParams.get("saveCard") === "true";
  const planParam = searchParams.get("plan");
  const selectedPlan = planParam ?? "guld";
  const prefilledPlate = searchParams.get("plate") ?? undefined;
  const carId = searchParams.get("carId") ?? undefined;
  const locationId = searchParams.get("location") ?? undefined;
  const equipmentId = searchParams.get("equipment") ?? undefined;
  const returnTo = searchParams.get("returnTo") ?? undefined;

  // Indlæs evt. gemt kort ved første render
  const gemtKort = hentGemtBetalingskort();

  // ─── State ──────────────────────────────────────────────────────────────────

  const [selectedPayment, setSelectedPayment] = useState<string | null>(
    saveCardOnly ? "card" : null,
  );
  const [walletMethod, setWalletMethod] = useState<"apple" | "google">("apple");

  // Kortfelter – udfyldes med gemt kort hvis tilgængeligt
  const [cardNumber, setCardNumber] = useState(gemtKort?.cardNumber ?? "");
  const [expiry, setExpiry] = useState(gemtKort?.expiry ?? "");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState(gemtKort?.name ?? "");
  const [rememberCard, setRememberCard] = useState(saveCardOnly || gemtKort !== null);

  // MobilePay-felter
  const [countryCode, setCountryCode] = useState("+45");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Wallet-samtykke
  const [walletConsent, setWalletConsent] = useState(false);

  // ─── Afledte værdier ────────────────────────────────────────────────────────

  const selectedPlanDetails = planParam
    ? paymentPlans.find((plan) => plan.slug === selectedPlan)
    : undefined;
  const selectedPlanAmount = selectedPlanDetails
    ? selectedPlanDetails.price.replace("kr.", " kr")
    : "0 kr";

  // Valideringsregler per betalingsmetode
  const kortErGyldig =
    selectedPayment === "card" &&
    cardNumber.replace(/\s/g, "").length >= 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvc.length >= 3 &&
    cardholderName.trim().length > 0;

  const mobilePayErGyldig =
    selectedPayment === "mobilepay" &&
    /^\+\d{1,3}$/.test(countryCode.trim()) &&
    phoneNumber.replace(/\s/g, "").length >= 8;

  const walletErGyldig = selectedPayment === "wallet" && walletConsent;

  const kanFortsætte =
    selectedPayment !== null &&
    selectedPayment !== "contactless" &&
    (selectedPayment !== "card" || kortErGyldig) &&
    (selectedPayment !== "mobilepay" || mobilePayErGyldig) &&
    (selectedPayment !== "wallet" || walletErGyldig);

  const visBetalingsdetaljer =
    selectedPayment !== null && selectedPayment !== "contactless";

  // Filtrer kontaktløs betaling fra når brugeren kun gemmer et kort
  const visteMedaljeMetoder = saveCardOnly
    ? betalingsmetoder.filter((m) => m.id !== "contactless")
    : betalingsmetoder;

  // ─── Hændelseshåndterere ────────────────────────────────────────────────────

  function handleVælgBetaling(id: string) {
    setSelectedPayment(id);
  }

  function handleFortsæt() {
    if (!selectedPayment || selectedPayment === "contactless") return;

    // Gem eller slet kortdata i localStorage afhængigt af brugerens valg
    if (selectedPayment === "card") {
      if (rememberCard) {
        window.localStorage.setItem(
          SAVED_PAYMENT_CARD_STORAGE_KEY,
          JSON.stringify({ cardNumber, expiry, name: cardholderName } satisfies GemtBetalingskort),
        );
      } else {
        window.localStorage.removeItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
      }
    }

    if (saveCardOnly) {
      router.push(returnTo ?? ROUTES.profile);
      return;
    }

    router.push(
      ROUTES.startWash(selectedPlan, selectedPayment, prefilledPlate ?? "", carId, locationId, equipmentId),
    );
  }

  // ─── Rendering ──────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-full flex-col">
      <PageInfo
        text={paymentPageContent.pageInfoTitle}
        userName={""}
        className="bg-[linear-gradient(rgba(255,255,255,0.4),rgba(255,255,255,0.4)),linear-gradient(90deg,var(--color-dashboard-gradient-start)_0%,var(--color-dashboard-gradient-end)_100%)]"
      />

      <section className="flex flex-1 flex-col px-6 pt-8 pb-6">
        <h1 className="mb-6 text-2xl font-bold text-white">
          {paymentPageContent.pageTitle}
        </h1>

        {/* Liste over tilgængelige betalingsmetoder */}
        <div className="space-y-3">
          {visteMedaljeMetoder.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              selected={selectedPayment === method.id}
              onClick={() => handleVælgBetaling(method.id)}
            />
          ))}
        </div>

        {/* Betalingsdetaljer vises kun når en metode er valgt */}
        {visBetalingsdetaljer && (
          <div key={selectedPayment} className="payment-reveal">
            {/* Sikker betaling-badge */}
            <div className="mt-6 flex items-center gap-4 text-white">
              <div className="h-1 w-20 bg-[rgba(0,19,12,0.65)]" />
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-[#7CFF45]" strokeWidth={3} />
                <span className="text-sm font-bold leading-none">
                  {paymentPageContent.secureMessage}
                </span>
              </div>
            </div>

            {/* Formular tilpasset den valgte betalingsmetode */}
            <div className="mt-6 rounded-lg bg-black/40 p-4">
              {selectedPayment === "card" && (
                <KortFormular
                  cardNumber={cardNumber}
                  expiry={expiry}
                  cvc={cvc}
                  cardholderName={cardholderName}
                  rememberCard={rememberCard}
                  onCardNumberChange={setCardNumber}
                  onExpiryChange={setExpiry}
                  onCvcChange={setCvc}
                  onCardholderNameChange={setCardholderName}
                  onRememberCardChange={setRememberCard}
                />
              )}

              {selectedPayment === "mobilepay" && (
                <MobilePayFormular
                  countryCode={countryCode}
                  phoneNumber={phoneNumber}
                  onCountryCodeChange={setCountryCode}
                  onPhoneNumberChange={setPhoneNumber}
                />
              )}

              {selectedPayment === "wallet" && (
                <WalletFormular
                  walletMethod={walletMethod}
                  selectedPlanAmount={selectedPlanAmount}
                  walletConsent={walletConsent}
                  onWalletMethodChange={setWalletMethod}
                  onWalletConsentChange={setWalletConsent}
                />
              )}
            </div>
          </div>
        )}

        {/* Fortsæt-knap – tekst afhænger af tilstand */}
        <div className="mt-auto pb-5 pt-4">
          <ContinueButton onClick={handleFortsæt} disabled={!kanFortsætte}>
            {saveCardOnly
              ? selectedPayment === "card"
                ? "Gem kort"
                : "Vælg metode"
              : paymentPageContent.buttons.continue}
          </ContinueButton>
        </div>
      </section>
    </div>
  );
}
