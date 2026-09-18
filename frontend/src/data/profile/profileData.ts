// profileData – statiske data og tekster til profilsiden og profil-opdateringssiden.
// Indeholder badges, menupunkter, klippekort-stempler og hjælpefunktionen getMissingProfileInfoState
// der bruges til at vise en toast hvis brugeren mangler bil eller betalingskort.

import type { ProfileBadge, ProfileMenuItem, ProfileStamp, ProfileVehicle, ProfilePaymentCard } from "@/types/profile";

export const SAVED_PAYMENT_CARD_STORAGE_KEY = "washworld-saved-payment-card";

// as const fjernet så vi kan tilføje nye felter uden TypeScript-fejl
export const profileUser = {
  userName: "Jeppe olsen",
  email: "Example@email.dk",
  phoneNumber: "+45 48 58 77 58",
  memberSince: "Januar 2022",
  subscription: "Premium",
  subscriptionRenewal: "01.08.2026",
};

export const profilePageNames = {
  title: "Profil",
  memberSinceLabel: "Medlem siden:",
  editProfile: "Rediger profil",
  updatedMessage: "Brugeroplysninger opdateret",
  preferencesUpdatedMessage: "Bruger præferencer ændret",
  clipCardTitle: "Klippekort",
  clipCardProgress: "3 ud af 5 vaske",
  badgesTitle: "Badges",
  badgesSubtitle: "Dine optjente badges",
  showAll: "Se alle",
  activeBadgeHint: "Tryk på et badge for at se hvordan det optjenes",
  logout: "Log ud",
  deleteAccount: "Slet konto",
} as const;

export const profileStamps: ProfileStamp[] = [
  { label: "W", filled: true },
  { label: "W", filled: true },
  { label: "W", filled: true },
  { label: "4", filled: false },
  { label: "5", filled: false },
];

export const profileBadges: ProfileBadge[] = [
  {
    id: 1,
    label: "Første vask",
    description: "Optjenes efter din allerførste vask.",
    achieved: true,
    image: "/badges/First_Wash.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 2,
    label: "5 vaske",
    description: "Optjenes efter din femte vask.",
    achieved: false,
    image: "/badges/5vaske.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 3,
    label: "10 vaske",
    description: "Optjenes efter din tiende vask.",
    achieved: false,
    image: "/badges/10vaske.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 4,
    label: "Vaskemester",
    description: "Optjenes når du har gennemført 15 vaske.",
    achieved: false,
    image: "/badges/Vaskemester.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 5,
    label: "Opret abonnement",
    description: "Optjenes når du opretter et abonnement.",
    achieved: false,
    image: "/badges/OpretAbonnement.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 6,
    label: "Tillad notifikationer",
    description: "Optjenes når du tillader push-notifikationer.",
    achieved: true,
    image: "/badges/TilladNotifikationer.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 7,
    label: "Vasker Ofte",
    description: "Optjenes når du vasker 5 gange inden for 30 dage.",
    achieved: true,
    image: "/badges/VaskerOfte-v2.png",
    lockedImage: "/badges/Locked.png",
  },
  {
    id: 8,
    label: "Udforsker",
    description: "Optjenes når du besøger 3 forskellige lokationer.",
    achieved: false,
    image: "/badges/Udforsker.png",
    lockedImage: "/badges/Locked.png",
  },
];

export const profileMenuItems: ProfileMenuItem[] = [
  { label: "Mine biler", href: "cars", iconKey: "sparkles" },
  { label: "Vaskehistorik", href: "vaskehistorik", iconKey: "calendar" },
  {
    label: "Betaling og kort",
    href: "betaling og kort",
    iconKey: "credit-card",
  },
  { label: "Notifikationer", href: "/notifications", iconKey: "bell" },
  { label: "Kundeservice", href: "/customer-service", iconKey: "question-mark" },
];

export const profileUpdatePageContent = {
  pageInfoTitle: "Profil",
  profileSectionTitle: "Profil",
  passwordSectionTitle: "Nulstil din adgangskode",
  memberSinceLabel: "Medlem siden",
  fields: {
    firstName: {
      label: "Fornavn",
      placeholder: "Indtast dit fornavn",
    },
    lastName: {
      label: "Efternavn",
      placeholder: "Indtast dit efternavn",
    },
    email: {
      label: "E-mail",
      placeholder: "Indtast din e-mail",
    },
    phoneNumber: {
      label: "Telefonnummer",
      placeholder: "Indtast dit telefonnummer",
    },
    newPassword: {
      label: "Ny adgangskode (valgfrit)",
      placeholder: "Indtast ny adgangskode",
    },
    confirmPassword: {
      label: "Gentag ny adgangskode",
      placeholder: "Gentag ny adgangskode",
    },
  },
  passwordHint: "Lad feltet være tomt, hvis du ikke vil ændre din adgangskode.",
  buttons: {
    save: "Gem ændringer",
    cancel: "Annuller",
    logout: "Log ud",
  },
} as const;

export const profileUpdateInitialValues = {
  firstName: "Jeppe",
  lastName: "Olsen",
  email: "jeppe.olsen@email.dk",
  phoneNumber: "+45 48 58 77 58",
  newPassword: "",
  confirmPassword: "",
} as const;

export const profileVehicles: ProfileVehicle[] = [];

export const profilePaymentCards: ProfilePaymentCard[] = [];

// Tjekker om brugeren mangler bil eller betalingskort og returnerer en status der bruges til dashboard-toasten.
export function getMissingProfileInfoState() {
  const missingVehicle = profileVehicles.length === 0;
  const hasStoredPaymentCard =
    typeof window !== "undefined" &&
    window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY) !== null;
  const missingPaymentCard =
    profilePaymentCards.length === 0 && !hasStoredPaymentCard;

  return {
    missingVehicle,
    missingPaymentCard,
    hasMissingProfileInfo: missingVehicle || missingPaymentCard,
  };
}
