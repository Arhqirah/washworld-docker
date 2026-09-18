// useSubscriptionPayment – al betalings-logik til abonnement-betalingssiden.
// Læser URL-parametre, henter gemt kort fra localStorage og styrer betalingsformularen.

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSubscriptionPlanBySlug } from "@/data/subscriptions/subscriptionData";
import { paymentOptions, paymentPageContent } from "@/data/payment/paymentData";
import { SAVED_PAYMENT_CARD_STORAGE_KEY } from "@/data/profile/profileData";
import { ROUTES } from "@/lib/routes";

type StoredPaymentCard = { cardNumber: string; expiry: string; name: string };

function getPaymentId(title: string) {
  const n = title.toLowerCase();
  if (n.includes("mobilepay")) return "mobilepay";
  if (n.includes("wallet") || n.includes("apple pay")) return "wallet";
  if (n.includes("kontakt")) return "contactless";
  return "card";
}

export const paymentMethods = paymentOptions
  .filter((o) => !o.title.toLowerCase().includes("kontakt"))
  .map((o, i) => ({
    id: getPaymentId(o.title),
    title: o.title,
    description: o.description,
    image: o.icon || `/payment/${i}.png`,
  }));

function getFirstPaymentAmount(firstMonth: string, fallback: string, surcharge = 0) {
  const match = firstMonth.match(/(\d+)\s*kr\./i);
  const base = match ? parseInt(match[1], 10) : parseInt(fallback, 10);
  return `${base + surcharge} kr`;
}

function formatRecurringAmount(price: string, surcharge = 0) {
  const match = price.match(/(\d+)/);
  if (!match) return price.replace("kr./ md.", " kr/md.");
  return `${parseInt(match[1], 10) + surcharge} kr/md.`;
}

export function useSubscriptionPayment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlanSlug = (searchParams.get("plan") ?? "guld").toLowerCase();
  const carId = searchParams.get("carId") ?? undefined;
  const allLocations = searchParams.get("allLocations") === "true";
  const locationId = searchParams.get("locationId") ?? undefined;

  const [storedPaymentCard] = useState<StoredPaymentCard | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  });

  const [selectedPayment, setSelectedPayment] = useState<string | null>(
    storedPaymentCard ? "card" : null,
  );
  const [useNewCard, setUseNewCard] = useState(storedPaymentCard === null);
  const [showCvcHelp, setShowCvcHelp] = useState(false);
  const [walletMethod, setWalletMethod] = useState<"apple" | "google">("apple");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [rememberCard, setRememberCard] = useState(true);
  const [walletConsent, setWalletConsent] = useState(false);

  const activePlan = getSubscriptionPlanBySlug(selectedPlanSlug);
  const locationSurcharge = allLocations ? 10 : 0;
  const firstPaymentAmount = getFirstPaymentAmount(activePlan.firstMonth, activePlan.price, locationSurcharge);
  const recurringAmount = formatRecurringAmount(activePlan.price, locationSurcharge);
  const selectedWalletMethod = paymentPageContent.wallet.methods.find((m) => m.value === walletMethod);
  const maskedNumber = storedPaymentCard
    ? `**** **** **** ${storedPaymentCard.cardNumber.replace(/\s/g, "").slice(-4)}`
    : null;

  const newCardIsValid =
    cardNumber.replace(/\s/g, "").length >= 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    cvc.length >= 3 &&
    cardholderName.trim().length > 0;

  const cardReady = selectedPayment === "card" && (useNewCard ? newCardIsValid : true);
  const walletReady = selectedPayment === "wallet" && walletConsent;
  const canContinue =
    selectedPayment !== null &&
    (selectedPayment !== "card" || cardReady) &&
    (selectedPayment !== "wallet" || walletReady);

  function handleSelectPayment(id: string) {
    setSelectedPayment(id);
    if (id !== "card") setShowCvcHelp(false);
  }

  function handleContinue() {
    if (!canContinue) return;
    if (selectedPayment === "card" && useNewCard && rememberCard) {
      window.localStorage.setItem(
        SAVED_PAYMENT_CARD_STORAGE_KEY,
        JSON.stringify({ cardNumber, expiry, name: cardholderName } satisfies StoredPaymentCard),
      );
    }
    router.push(ROUTES.subscriptionConfirmation(selectedPlanSlug, carId, allLocations, locationId));
  }

  return {
    // Plan og betalingsinfo
    activePlan,
    allLocations,
    firstPaymentAmount,
    recurringAmount,
    // Gemt kort
    storedPaymentCard,
    maskedNumber,
    useNewCard,
    setUseNewCard,
    // Valgt metode
    selectedPayment,
    handleSelectPayment,
    // Kortformular
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
    // Wallet
    walletMethod,
    setWalletMethod,
    walletConsent,
    setWalletConsent,
    selectedWalletMethod,
    // Validering og navigation
    canContinue,
    handleContinue,
  };
}
