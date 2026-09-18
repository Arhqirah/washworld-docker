// paymentData – statiske data til betalingssiderne: betalingsmetoder (kort, MobilePay, wallet, kontaktløs)
// og alle labels/tekster til betalingsformularerne. Importeres af betaling/page.tsx og abonnement/betaling/page.tsx.

export const paymentOptions = [
  {
    title: "Kreditkort",
    description: "Betal med Kredit- eller betalingskort",
    selected: true,
    icon: "/icons/payment-protection.png",
  },
  {
    title: "MobilePay",
    description: "Hurtig og sikker betaling",
    selected: false,
    icon: "/icons/MobilePay.png",
  },
  {
    title: "Wallet",
    description: "Brug dine gemte betalingsoplysninger",
    selected: false,
    icon: "/icons/Wallet.png",
  },
  {
    title: "Kontaktløs",
    description: "Hold telefonen hen til terminalen",
    selected: false,
    icon: "/icons/contactless.svg",
  },
];

export const paymentPageContent = {
  pageInfoTitle: "Betalingsmetoder",
  pageTitle: "Vælg betalingsmetode",
  secureMessage: "Sikker betaling med krypteret forbindelse",
  buttons: {
    back: "Tilbage",
    continue: "Videre",
  },
  card: {
    cardNumberLabel: "Kortnummer",
    cardNumberPlaceholder: "1234 5678 9012 3456",
    expiryLabel: "Udløbsdato",
    expiryPlaceholder: "MM/ÅÅ",
    cvcLabel: "CVC",
    cvcPlaceholder: "123",
    cvcHelpLabel: "Hvad er CVC?",
    cvcHelpText: "CVC er de 3 cifre på bagsiden af dit betalingskort.",
    nameLabel: "Navn på kort",
    namePlaceholder: "Kortholderens navn",
    rememberCardLabel: "Husk mit kort",
  },
  mobilePay: {
    phoneLabel: "Mobilnummer",
    countryCodePlaceholder: "+45",
    phonePlaceholder: "12 34 56 78",
    payButton: "Betal med MobilePay",
    payButtonIcon: "/icons/MobilePay.png",
    infoText:
      "Du modtager en anmodning i MobilePay-appen, som du skal godkende for at gennemføre betalingen",
  },
  wallet: {
    title: "Betal med Wallet",
    description:
      "Du bliver viderestillet til Apple Pay / Google Pay for at gennemføre betalingen.",
    methodLabel: "Betalingsmetode",
    amountLabel: "Beløb",
    amount: "149.00 DDK",
    consentText:
      "Du godkender betalingen med Face ID, Touch ID eller adgangskode",
    methods: [
      {
        value: "apple",
        label: "Apple Pay",
        logo: "/logos/ApplePay.jpg",
        imageClassName: "h-11 w-auto max-w-full object-contain",
      },
      {
        value: "google",
        label: "Google Pay",
        logo: "/logos/GooglePay.jpg",
        imageClassName: "h-6 w-auto max-w-full object-contain",
      },
    ],
  },
} as const;
