// Samlet eksport af alle custom hooks i projektet.
// Importer altid hooks herfra ("@/hooks") frem for direkte fra den enkelte fil,
// så man nemt kan se hvad der er tilgængeligt og refaktorere uden at opdatere alle imports.
//
// Hooks og hvad de bruges til:
//   useAuth            → login-session, token, bruger-objekt, login/logout
//   useFavorites       → favorit-lokationer gemt i localStorage, toggle og isFavorite
//   useNavVisibility   → skjul/vis bottomnavigationen (fx under aktiv vask)
//   useVehicles        → brugerens køretøjer, CRUD-operationer, loading/error
//   useClickOutside    → luk en dropdown/menu ved klik udenfor et element
//   useAnimatedToast   → animationsfaser (enter/exit) til toast-beskeder
//   useNearestLocation → GPS + haversine til at finde og sortere lokationer efter afstand
//   useReceiptHistory  → henter vaskelog + abonnementer + biler og bygger kvitteringsliste
//   useSubscriptions   → henter brugerens abonnementer (bruges på profil og detalje-side)
//   useLocationDetails → henter lokationsdata + udstyr for én lokation (bruges på details-siden)
//   usePlanCarousel    → styrer planvalg (Guld/Premium/Brilliant), slideretning og animKey (subscriptions + singlewash)
//   useUpdateProfile         → formular-logik til profil-redigering (formState, gem, slet konto)
//   useSubscriptionPayment   → betalingstilstand og logik til abonnement-betalingssiden

export { useAuth } from "./auth/useAuth";
export { useNavVisibility } from "./auth/useNavVisibility";
export { useFavorites } from "./favorites/useFavorites";
export { useLocationDetails } from "./location/useLocationDetails";
export { useNearestLocation } from "./location/useNearestLocation";
export { useUpdateProfile } from "./profile/useUpdateProfile";
export { useReceiptHistory } from "./receipts/useReceiptHistory";
export { useSubscriptions } from "./subscriptions/useSubscriptions";
export { useSubscriptionPayment } from "./subscriptions/useSubscriptionPayment";
export { useVehicles } from "./vehicles/useVehicles";
export { useClickOutside } from "./ui/useClickOutside";
export { useAnimatedToast } from "./ui/useAnimatedToast";
export { usePlanCarousel } from "./ui/usePlanCarousel";
