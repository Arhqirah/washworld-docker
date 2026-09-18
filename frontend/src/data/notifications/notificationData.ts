// notificationData – tekster og standardindstillinger til notifikationssiden.

export type NotificationSetting = {
  id: string
  title: string
  description: string
  enabled: boolean
  accent: "green" | "orange"
}

export const notificationPageContent = {
  pageInfoTitle: "Notifikationer",
  title: "Administrer dine notifikationer",
  description: "Vælg hvilke opdateringer du vil modtage fra Wash World.",
  masterToggleLabel: "Tillad push-notifikationer",
  masterToggleDescription:
    "Slå alle app-notifikationer til eller fra på én gang.",
  saveButton: "Gem ændringer",
  updatedMessage: "Bruger præferencer ændret",
} as const;

export const notificationSettings: NotificationSetting[] = [
  {
    id: "offers",
    title: "Tilbud og kampagner",
    description: "Få besked om rabatter, kampagner og nye medlemsfordele.",
    enabled: true,
    accent: "green",
  },
  {
    id: "subscription",
    title: "Abonnement",
    description: "Påmindelser om betalinger, ændringer og fornyelser.",
    enabled: true,
    accent: "green",
  },
  {
    id: "wash-status",
    title: "Vaskestatus",
    description: "Live-opdateringer om aktive vaske og eventuelle afbrydelser.",
    enabled: true,
    accent: "orange",
  },
  {
    id: "location-news",
    title: "Lokationer",
    description: "Nyt om åbningstider, driftsstatus og nye vaskehaller.",
    enabled: false,
    accent: "green",
  },
] as const;
