// subscriptionData – data og tekster til abonnementssiderne.
// subscriptionPlans definerer de tre abonnementstyper (Guld, Premium, Brilliant) med priser, produktId'er og featurer.
// getSubscriptionPlanBySlug() bruges til at hente det valgte abonnement baseret på URL-parameteren.

import type { SubscriptionFeature, SubscriptionPlan, SubscriptionOption } from "@/types/subscriptions";

export const subscriptionPageNames = {
  listTitle: "Abonnement",
  createTitle: "Opret",
  createTitleLineOne: "Opret",
  createTitleLineTwo: "vaskeabonnement",
  createDescription: "Hold din bil ren med et vaskeabonnement og spar penge",
  createButton: "Opret vaskeabonnement",
  footnote:
    "*Gælder kun nummerplader, der ikke før har haft et abonnement hos Wash world.",
  pickerIntro: "Vælg bil og betalingsmiddel til dit vaskeabonnement",
  vehiclePlaceholder: "Vælg køretøj",
  paymentPlaceholder: "Vælg betalingsmetode",
  selectButton: "Vælg",
  termsPrefix: "Jeg accepterer",
  termsLinkLabel: "abonnementsvilkår",
  backButton: "Tilbage",
  submitButton: "Opret",
  vehicleSheetTitle: "Vælg køretøj",
  paymentSheetTitle: "Vælg betalingsmetode",
} as const;

export const subscriptionPaymentPageContent = {
  pageInfoTitle: "Kortoplysninger",
  pageTitle: "Tilføj betalingsoplysninger",
  buttons: {
    back: "Tilbage",
    continue: "Tilføj kort",
  },
} as const;

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    slug: "guld",
    name: "Guld",
    price: "139kr./ md.",
    priceNumber: 139,
    singleWashPrice: 59,
    productId: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    firstMonth: "Første måned 99kr.",
    description: "God og effektiv",
    features: [
      { text: "Skumforvask", level: 1 },
      { text: "Tørring", level: 1 },
      { text: "Aktiv Shampoo", level: 1 },
      { text: "Højglans", level: 0 },
      { text: "Hjulvask", level: 1 },
      { text: "Undervognsvask", level: 0 },
      { text: "Højtryksvask", level: 1 },
      { text: "Skumvask", level: 0 },
      { text: "Børstevask", level: 1 },
      { text: "Affedtning", level: 0 },
      { text: "Voks", level: 1 },
      { text: "Sæsonrens", level: 0 },
    ],
  },
  {
    slug: "premium",
    name: "Premium",
    price: "169kr./ md.",
    priceNumber: 169,
    singleWashPrice: 89,
    productId: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
    firstMonth: "Første måned 129kr.",
    description: "Ekstra grundig",
    features: [
      { text: "Skumforvask", level: 1 },
      { text: "Tørring", level: 1 },
      { text: "Aktiv Shampoo", level: 1 },
      { text: "Højglans", level: 1 },
      { text: "Hjulvask", level: 1 },
      { text: "Undervognsvask", level: 1 },
      { text: "Højtryksvask", level: 1 },
      { text: "Skumvask", level: 0 },
      { text: "Børstevask", level: 2 },
      { text: "Affedtning", level: 0 },
      { text: "Voks", level: 1 },
      { text: "Sæsonrens", level: 0 },
    ],
  },
  {
    slug: "brilliant",
    name: "Brilliant",
    price: "199kr./ md.",
    priceNumber: 199,
    singleWashPrice: 119,
    productId: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    firstMonth: "Første måned 159kr.",
    description: "Bedste vask året rundt",
    features: [
      { text: "Skumforvask", level: 2 },
      { text: "Tørring", level: 2 },
      { text: "Aktiv Shampoo", level: 1 },
      { text: "Højglans", level: 1 },
      { text: "Hjulvask", level: 1 },
      { text: "Undervognsvask", level: 1 },
      { text: "Højtryksvask", level: 2 },
      { text: "Skumvask", level: 1 },
      { text: "Børstevask", level: 2 },
      { text: "Affedtning", level: 1 },
      { text: "Voks", level: 2 },
      { text: "Sæsonrens", level: 2 },
    ],
  },
];

export const subscriptionVehicles: SubscriptionOption[] = [
  { value: "", label: "Vælg køretøj" },
  { value: "abc12345", label: "ABC12345 - Tesla Model 3" },
  { value: "def67890", label: "DEF67890 - Audi A4" },
];

export const subscriptionPaymentMethods: SubscriptionOption[] = [
  { value: "card", label: "Kort •••• 4242" },
  { value: "mobilepay", label: "MobilePay" },
  { value: "wallet", label: "Apple Pay / Google Pay" },
];

// Finder et abonnementsplan ud fra dets slug (fx "guld"), eller returnerer Guld som standard.
export function getSubscriptionPlanBySlug(slug: string) {
  return (
    subscriptionPlans.find((plan) => plan.slug === slug) || subscriptionPlans[0]
  );
}
