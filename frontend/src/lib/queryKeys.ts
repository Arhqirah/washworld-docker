// queryKeys – ét centralt sted for alle React Query cache-nøgler.
// Import QUERY_KEYS i stedet for at skrive inline strings i useQuery-kald.
// Det giver overblik over alle backend-forbindelser og gør cache-invalidering eksplicit.
//
// Oversigt over hvad der fetches:
//   locations          → GET /api/locations           (alle vaskelokationer)
//   location(id)       → GET /api/locations + filter  (én lokation via locationsApi)
//   locationEquipment  → GET /api/equipment/:id       (maskiner på én lokation)
//   offers             → GET /api/offers               (nyheder/tilbud til dashboard)
//   cars(uid)          → GET /api/users/:uid/cars      (brugerens biler)
//   washLog(uid)       → GET /api/users/:uid/washlogs  (vaskehistorik)
//   subscriptions(uid) → GET /api/users/:uid/subscriptions (brugerens abonnementer)
//   receiptHistory(uid)→ washLog + subscriptions + cars kombineret til kvitteringsliste
//   subscriptionDetail(uid) → subscriptions + cars kombineret til detaljevisning

export const QUERY_KEYS = {
  locations:          ()          => ["locations"]            as const,
  location:           (id: string)    => ["location", id]        as const,
  locationEquipment:  (id: string)    => ["locationEquipment", id] as const,
  offers:             ()          => ["offers"]               as const,
  cars:               (uid: string)   => ["cars", uid]           as const,
  washLog:            (uid: string)   => ["washLog", uid]        as const,
  subscriptions:      (uid: string)   => ["subscriptions", uid]  as const,
  receiptHistory:     (uid: string)   => ["receiptHistory", uid] as const,
  subscriptionDetail: (uid: string)   => ["subscriptionDetail", uid] as const,
} as const;
