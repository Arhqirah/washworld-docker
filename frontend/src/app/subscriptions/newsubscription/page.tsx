"use client";

// HandleSubscriptionPage – opret et nyt abonnement.
// Siden modtager valgt plan via URL-parameteren ?plan=guld|sølv|bronze.

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { SAVED_PAYMENT_CARD_STORAGE_KEY } from "@/data/profile/profileData";
import { useVehicles } from "@/hooks";
import {
  getSubscriptionPlanBySlug,
  subscriptionPageNames,
} from "@/data/subscriptions/subscriptionData";
import PageInfo from "@/components/shared/PageInfo";
import BottomSheet from "@/components/shared/BottomSheet";
import { Button } from "@/components/buttons";
import { createSubscription } from "@/lib/subscriptionsApi";
import { ROUTES } from "@/lib/routes";

// Kompakt bil-ikon til køretøjsvælgeren
function CarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden="true">
      <path d="M4.7 13.2h14.6l-1-3.3a2 2 0 0 0-1.9-1.4H7.6a2 2 0 0 0-1.9 1.4l-1 3.3Zm-.7 1.5A2 2 0 0 1 6 13h12a2 2 0 0 1 2 1.7l.4 2.8a.75.75 0 0 1-.75.85h-1.4a.75.75 0 0 1-.75-.75V17H6.5v.55a.75.75 0 0 1-.75.75H4.35a.75.75 0 0 1-.75-.85L4 14.7Z" />
      <circle cx="7.6" cy="15.5" r="1" />
      <circle cx="16.4" cy="15.5" r="1" />
    </svg>
  );
}

// Kompakt kreditkort-ikon til betalingsvælgeren
function CardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4.5 w-4.5" aria-hidden="true">
      <path d="M3.5 6.25A1.75 1.75 0 0 1 5.25 4.5h13.5a1.75 1.75 0 0 1 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V6.25Zm1.5 2v2h14v-2H5Zm0 4v5.5h14v-5.5H5Z" />
    </svg>
  );
}

export default function HandleSubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vehicles, refreshVehicles } = useVehicles();

  const planKey = (searchParams.get("plan") || "guld").toLowerCase();
  const preselectedCarId = searchParams.get("carId") ?? null;
  const activePlan = useMemo(() => getSubscriptionPlanBySlug(planKey), [planKey]);

  const savedVehicleOptions = useMemo(
    () => vehicles.map((vehicle) => ({
      value: String(vehicle.id),
      label: `${vehicle.plate} - ${vehicle.name}`,
    })),
    [vehicles],
  );
  const hasSavedVehicle = savedVehicleOptions.length > 0;
  const initialVehicleValue =
    (preselectedCarId && savedVehicleOptions.find((o) => o.value === preselectedCarId)?.value) ??
    savedVehicleOptions.find(
      (option) => option.value === String(vehicles.find((v) => v.active)?.id),
    )?.value ??
    savedVehicleOptions[0]?.value ??
    "";

  const [savedCard] = useState<{ cardNumber: string; expiry: string; name: string } | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  });

  const paymentMethods = useMemo(() => {
    const last4 = savedCard?.cardNumber.replace(/\s/g, "").slice(-4);
    return [
      { value: "card", label: last4 ? `Kort •••• ${last4}` : "Kreditkort" },
      { value: "mobilepay", label: "MobilePay" },
      { value: "wallet", label: "Apple Pay / Google Pay" },
    ];
  }, [savedCard]);

  const [vehicle, setVehicle] = useState(initialVehicleValue);
  const [paymentMethod, setPaymentMethod] = useState(() => savedCard ? "card" : "");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [activeSheet, setActiveSheet] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedVehicleLabel = vehicle ? savedVehicleOptions.find((o) => o.value === vehicle)?.label : "";
  const selectedPaymentMethodLabel = paymentMethod ? paymentMethods.find((m) => m.value === paymentMethod)?.label : "";
  const canSubmit = Boolean(vehicle) && Boolean(paymentMethod) && acceptedTerms;
  const isSheetOpen = activeSheet !== null;
  const sheetTitle =
    activeSheet === "vehicle"
      ? subscriptionPageNames.vehicleSheetTitle
      : subscriptionPageNames.paymentSheetTitle;

  // MariaDB forventer datetime i formatet "YYYY-MM-DD HH:MM:SS"
  function formatDate(d: Date): string {
    return d.toISOString().slice(0, 19).replace("T", " ");
  }

  async function handleSubmit() {
    if (!vehicle || !paymentMethod || !acceptedTerms) {
      setAttempted(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // Beregn datoer: start = nu, slut = om 1 år, næste betaling = om 1 måned
    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);
    const nextBilling = new Date(now);
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    // Strip alt ikke-numerisk fra prisstreng, fx "139kr./md." → 139
    const priceRaw = parseInt(activePlan.price.replace(/[^0-9]/g, ""), 10);

    try {
      await createSubscription({
        car_id: vehicle,
        subscription_name: activePlan.name,
        subscription_price: priceRaw,
        subscription_status: "aktiv",
        subscription_start_date: formatDate(now),
        subscription_end_date: formatDate(endDate),
        subscription_next_billing_date: formatDate(nextBilling),
      });
      await refreshVehicles();
      router.push(ROUTES.profile);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Kunne ikke oprette abonnement");
      setIsSubmitting(false);
    }
  }

  // Gemmer den valgte værdi i den korrekte state og lukker sheetet
  function selectFromSheet(value: string) {
    if (activeSheet === "vehicle") setVehicle(value);
    if (activeSheet === "payment") setPaymentMethod(value);
    setActiveSheet(null);
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <PageInfo text={subscriptionPageNames.createTitle} userName="" />
      <main className="flex-1 overflow-y-auto px-6 pt-3.5 pb-4 text-white scrollbar-hide">
        <h1 className="text-center text-[2rem] font-bold leading-tight">
          {subscriptionPageNames.createTitleLineOne}
          <br />
          {subscriptionPageNames.createTitleLineTwo}
        </h1>
        <p className="mx-auto mt-1 max-w-64 text-center text-[1rem] font-semibold leading-tight">
          {subscriptionPageNames.createDescription}
        </p>

        <div className="mx-auto mt-3.5 w-full max-w-74 bg-(--brand-green-01) px-4 py-6 text-center shadow-lg">
          <h2 className="text-[2rem] font-bold leading-none">{activePlan.name}</h2>
          <p className="mt-1.5 text-[1rem] font-bold leading-none">{activePlan.price}</p>
          <p className="mt-1 text-[1.2rem] font-bold leading-none">{activePlan.firstMonth}</p>
        </div>

        <p className="mx-auto mt-2 max-w-74 text-center text-[0.95rem] leading-tight">
          {subscriptionPageNames.footnote}
        </p>

        <div className="mt-20">
          <p className="mx-auto max-w-68 text-center text-[1.2rem] font-bold leading-tight">
            {subscriptionPageNames.pickerIntro}
          </p>

          <div className="mx-auto mt-3.5 flex w-full max-w-72 flex-col gap-1.5">
            <div>
              {hasSavedVehicle ? (
                <div className="relative flex h-9.5 items-center overflow border border-(--brand-green-01) bg-(--white-white)">
                  <span className="pl-2 pr-1 text-(--brand-green-01)"><CarIcon /></span>
                  <span className="flex-1 truncate pr-4 text-[1rem] font-semibold text-black">
                    {selectedVehicleLabel || subscriptionPageNames.vehiclePlaceholder}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSheet("vehicle")}
                    className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
                  >
                    {subscriptionPageNames.selectButton}
                  </button>
                </div>
              ) : (
                <div className="relative flex h-9.5 items-center overflow border border-(--color-grey-02) bg-(--white-white)">
                  <span className="pl-2 pr-1 text-(--color-grey-01)"><CarIcon /></span>
                  <span className="flex-1 pr-4 text-[1rem] font-semibold text-(--color-grey-01)">
                    Ingen køretøjer tilknyttet
                  </span>
                  <Link
                    href={ROUTES.addCar}
                    className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
                  >
                    + Tilføj
                  </Link>
                </div>
              )}
              {attempted && !vehicle && (
                <p className="mt-1 text-xs font-semibold text-red-400">Vælg venligst et køretøj</p>
              )}
            </div>

            <div>
              <div className={`relative flex h-9.5 items-center overflow border bg-(--white-white) ${paymentMethod ? "border-(--brand-green-01)" : attempted ? "border-red-400" : "border-(--color-grey-02)"}`}>
                <span className={`pl-2 pr-1 ${paymentMethod ? "text-(--brand-green-01)" : "text-(--color-grey-01)"}`}>
                  <CardIcon />
                </span>
                <span className={`flex-1 pr-20 text-[1rem] font-semibold ${paymentMethod ? "text-black" : "text-(--color-grey-01)"}`}>
                  {selectedPaymentMethodLabel || subscriptionPageNames.paymentPlaceholder}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSheet("payment")}
                  className="absolute top-2.25 -right-px -bottom-px flex min-w-19 items-center justify-center bg-(--brand-green-01) px-3 text-center text-[1rem] font-bold text-white [clip-path:polygon(16%_0,100%_0,100%_100%,0_100%)]"
                >
                  {subscriptionPageNames.selectButton}
                </button>
              </div>
              {attempted && !paymentMethod && (
                <p className="mt-1 text-xs font-semibold text-red-400">Vælg venligst en betalingsmetode</p>
              )}
            </div>
          </div>

          <label className="mx-auto mt-2.5 flex w-full max-w-72 items-center justify-center gap-2 text-[0.95rem] font-semibold text-(--white-white)">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 accent-(--brand-green-01)"
            />
            <span>
              {subscriptionPageNames.termsPrefix}{" "}
              <a href="#" className="text-(--color-secondary)">{subscriptionPageNames.termsLinkLabel}</a>
            </span>
          </label>

          {submitError && (
            <p className="mx-auto mt-3 max-w-72 text-center text-sm font-semibold text-red-400">
              {submitError}
            </p>
          )}

          <div className="mx-auto mt-5.5 w-full max-w-69">
            <Button
              variant="primary"
              size="lg"
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Opretter..." : subscriptionPageNames.submitButton}
            </Button>
          </div>
        </div>
      </main>

      <BottomSheet isOpen={isSheetOpen} title={sheetTitle} onClose={() => setActiveSheet(null)}>
        {activeSheet === "vehicle" ? (
          vehicles.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => selectFromSheet(String(v.id))}
              className="flex w-full items-center gap-3 rounded-xl border border-(--color-grey-02) bg-(--color-surface) px-4 py-3 text-left active:bg-neutral-100"
            >
              <div className="flex h-8 shrink-0 overflow-hidden border-2 border-neutral-800 bg-white text-neutral-950">
                <span className="flex w-5 items-center justify-center bg-[#327fc2]" />
                <span className="flex items-center px-2.5 text-[13px] font-bold tracking-[0.08em]">{v.plate}</span>
              </div>
              {v.name && v.name !== v.plate && (
                <span className="flex-1 truncate text-sm font-semibold text-neutral-600">{v.name}</span>
              )}
              <span className={`ml-auto shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                v.subscriptionName ? "bg-emerald-400 text-emerald-900" : "bg-neutral-300 text-neutral-600"
              }`}>
                {v.subscriptionName ?? "Ingen abonnement"}
              </span>
            </button>
          ))
        ) : (
          paymentMethods.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => selectFromSheet(item.value)}
              className="w-full rounded-xl border border-(--color-grey-02) bg-(--color-surface) px-4 py-3 text-left text-[1rem] font-semibold"
            >
              {item.label}
            </button>
          ))
        )}
      </BottomSheet>
    </div>
  );
}
