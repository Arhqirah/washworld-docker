// ROUTES er en central oversigt over alle URL-stier i appen.
// Brug altid disse konstanter frem for at skrive URL-strenge direkte,
// så en ændring i en URL kun skal ske ét sted.
// Funktioner (fx details, payment) bygger URL'en automatisk med de rigtige parametre.
export const ROUTES = {
  // Utility
  underConstruction: "/under-construction",

  // Auth
  login: "/login",
  signup: "/signup",
  resetPassword: "/reset-password",
  resetPasswordConfirm: (key: string) => `/reset-password/confirm?key=${encodeURIComponent(key)}`,
  terms: "/terms",

  // Main
  dashboard: "/dashboard",
  profile: "/profiles",
  profileUpdated: "/profiles?updated=1",
  profileUpdatedPreferences: "/profiles?updated=preferences",
  updateProfile: "/profiles/updateprofile",
  notifications: "/notifications",
  customerService: "/customer-service",

  // Locations
  map: "/locations/map",
  locationList: "/locations/list",
  details: (id: string) => `/details?id=${encodeURIComponent(id)}`,

  // Single wash flow
  singlewash: "/singlewash",
  paymentSettings: "/payments",
  savePaymentCard: "/payments?saveCard=true",
  payment: (plan: string, plate?: string, carId?: string, locationId?: string, equipmentId?: string) =>
    `/payments?plan=${plan}${plate ? `&plate=${encodeURIComponent(plate)}` : ""}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${locationId ? `&location=${encodeURIComponent(locationId)}` : ""}${equipmentId ? `&equipment=${encodeURIComponent(equipmentId)}` : ""}`,
  licensePlate: (plan: string, payment: string, plate?: string, carId?: string) =>
    `/singlewash/licenseplate?plan=${plan}&payment=${payment}${plate ? `&plate=${encodeURIComponent(plate)}` : ""}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}`,
  startWash: (plan: string, payment: string, plate: string, carId?: string, locationId?: string, equipmentId?: string) =>
    `/singlewash/startwash?plan=${plan}&payment=${payment}&plate=${encodeURIComponent(plate)}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${locationId ? `&location=${encodeURIComponent(locationId)}` : ""}${equipmentId ? `&equipment=${encodeURIComponent(equipmentId)}` : ""}`,
  activeWash: (plan: string, payment: string, plate: string, carId?: string, locationId?: string, equipmentId?: string) =>
    `/activewash?plan=${plan}&payment=${payment}&plate=${encodeURIComponent(plate)}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${locationId ? `&location=${encodeURIComponent(locationId)}` : ""}${equipmentId ? `&equipment=${encodeURIComponent(equipmentId)}` : ""}`,
  activeWashSubscription: (location: string, equipment: string, carId?: string) =>
    `/activewash?subscription=true&location=${location}&equipment=${equipment}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}`,
  startWashSubscription: (location: string, equipment: string, carId?: string) =>
    `/singlewash/startwash?subscription=true&location=${encodeURIComponent(location)}&equipment=${encodeURIComponent(equipment)}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}`,

  // Self wash
  selfWash: (location: string, equipment: string) =>
    `/selfwash?location=${location}&equipment=${equipment}`,

  // Subscription flow
  subscription: "/subscriptions",
  subscriptionForCar: (carId: string) => `/subscriptions?carId=${encodeURIComponent(carId)}`,
  subscriptionPayment: (plan: string, carId?: string, allLocations?: boolean, locationId?: string) =>
    `/subscriptions/payment?plan=${plan}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${allLocations ? "&allLocations=true" : ""}${locationId ? `&locationId=${encodeURIComponent(locationId)}` : ""}`,
  subscriptionConfirmation: (plan: string, carId?: string, allLocations?: boolean, locationId?: string) =>
    `/subscriptions/newsubscription?plan=${plan}${carId ? `&carId=${encodeURIComponent(carId)}` : ""}${allLocations ? "&allLocations=true" : ""}${locationId ? `&locationId=${encodeURIComponent(locationId)}` : ""}`,

  // Vehicles
  cars: "/cars",
  addCar: "/cars/add",
  editCar: (id: string) => `/cars/edit/${id}`,

  // Wash history
  washHistory: "/receipts",
  washHistoryDetails: "/receipts/details",
} as const;
