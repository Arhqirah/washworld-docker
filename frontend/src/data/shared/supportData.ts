// supportData – data til kundeservicesiden: kontaktkort (ring, skriv, aktiv vask) og FAQ-spørgsmål.

export type SupportContactCard = {
  id: string
  title: string
  subtitle?: string
  description?: string
  actionLabel: string
  actionType: "call" | "message" | "urgent"
  href?: string
}

export type SupportFaqItem = {
  id: string
  question: string
  answer: string
}

export const supportPageContent = {
  pageInfoTitle: "Kundeservice",
  introTitle: "Har du brug for hjælp?",
  introSubtitle: "Vælg en mulighed herunder:",
  faqTitle: "Ofte stillede spørgsmål",
} as const;

export const supportContactCards: SupportContactCard[] = [
  {
    id: "call",
    title: "Ring til support",
    actionLabel: "Ring",
    actionType: "call",
    href: "tel:+4548587758",
  },
  {
    id: "message",
    title: "Send besked",
    subtitle: "Svar inden for kort tid",
    actionLabel: "Skriv",
    actionType: "message",
    href: "mailto:support@washworld.dk",
  },
  {
    id: "active-wash",
    title: "Aktiv vask",
    description:
      "Hvis noget går galt under vasken, kan du få hjælp med det samme",
    actionLabel: "HJÆLP",
    actionType: "urgent",
    href: "tel:+4548587758",
  },
] as const;

export const supportFaqItems: SupportFaqItem[] = [
  {
    id: "start-wash",
    question: "Hvordan starter jeg en vask?",
    answer:
      "Vælg din vask i appen, gennemfør betalingen og følg derefter instruktionerne på skærmen ved vaskehallen.",
  },
  {
    id: "stop-subscription",
    question: "Hvordan afbryder jeg et abonnement?",
    answer:
      "Hvis du ønsker at afbryde dit abonnement, skal du trykke på 'Administrer abonnement' i appen og vælge 'Afbryd abonnement'.",
  },
  {
    id: "badges",
    question: "Hvor ser jeg mine badges?",
    answer: "Dine badges vises på profilsiden under dine medlemsoplysninger.",
  },
  {
    id: "locations",
    question: "Hvor finder jeg vaskehaller?",
    answer:
      "Du kan finde alle lokationer via kortet eller listevisningen i appen.",
  },
  {
    id: "payments",
    question: "Hvilke betalingsmetoder kan jeg bruge?",
    answer:
      "Du kan betale med betalingskort, MobilePay og wallet-løsninger som Apple Pay og Google Pay.",
  },
] as const;
