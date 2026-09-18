// singleWashData – statiske data til enkelt-vask-flowet: tekster til de tre sider (valg, nummerplade, klargøring),
// råd om klargøring inden vask og de tre vaskeprogram-planer (Guld, Premium, Brilliant) med featurer og priser.

import type { PaymentPlanFeature, PaymentPlan, SingleWashAdviceItem } from "@/types/wash";

export const singleWashPageContent = {
  pageInfoTitle: "Enkelt vask",
  pageTitleLineOne: "Vælg",
  pageTitleLineTwo: "vaskeprogram",
  description: "Vælg det program du vil bruge til denne vask.",
  buttons: {
    back: "Tilbage",
    continue: "Videre",
  },
} as const;

export const singleWashPlatePageContent = {
  pageInfoTitle: "Enkelt Vask",
  title: "Vi aflæser din nummerplade...",
  infoLabel: "Sådan virker det",
  infoText:
    "Vi forsøger først at læse nummerpladen automatisk. Hvis det ikke virker, kan du indtaste den manuelt og fortsætte.",
  illustrationAlt: "Bil ved nummerpladescanner",
  manualLabel: "Indtast manuelt",
  manualPlaceholder: "DB 43 234",
  buttons: {
    back: "Tilbage",
    continue: "Videre",
  },
} as const;

export const singleWashReadyPageContent = {
  pageInfoTitle: "Enkelt Vask",
  title: "Kør ind til vask...",
  subtitle: "Følg instrukserne på skærmen",
  infoLabel: "Sådan virker det",
  infoText:
    "Kør langsomt frem til anlægget og følg vejledningen på skærmen. Når bilen står korrekt, kan du starte vasken.",
  illustrationAlt: "Bil med kørselsinstruktioner",
  ctaLabel: "Tryk start når du er klar",
  startButton: "Start vask",
} as const;

export const singleWashAdviceContent = {
  title: "Råd om vask",
  rememberLabel: "Husk",
  continueLabel: "Videre",
  closeLabel: "Luk",
  openLabel: "Se råd om vask",
  items: [
    {
      id: "antenna",
      title: "Fjern antenne!",
      image: "/advice_about_wash/FjernAntenne.png",
      alt: "Bilantenne der skal fjernes før vask",
    },
    {
      id: "mirrors",
      title: "Skub spejlene ind!",
      image: "/advice_about_wash/SkubSpejleInd.png",
      alt: "Sidespejl der skal foldes ind før vask",
    },
    {
      id: "handbrake",
      title: "Træk håndbremsen op!",
      image: "/advice_about_wash/HandbreakOp.png",
      alt: "Håndbremse der skal trækkes op før vask",
    },
    {
      id: "fuel",
      title: "Luk tanklåget!",
      image: "/advice_about_wash/LukTankKlap.png",
      alt: "Tankklap der skal lukkes før vask",
    },
    {
      id: "windows",
      title: "Luk vinduerne!",
      image: "/advice_about_wash/LukVinduer.png",
      alt: "Vinduer der skal lukkes før vask",
    },
    {
      id: "sunroof",
      title: "Luk soltaget!",
      image: "/advice_about_wash/LukSoltaget.png",
      alt: "Soltag der skal lukkes før vask",
    },
  ] satisfies SingleWashAdviceItem[],
} as const;

export const paymentPlans: PaymentPlan[] = [
  {
    slug: "guld",
    name: "Guld",
    price: "59kr.",
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
    price: "89kr.",
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
    price: "119kr.",
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
