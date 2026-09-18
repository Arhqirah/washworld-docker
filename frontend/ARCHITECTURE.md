# WashWorld Frontend — Arkitektur

## Mappestruktur

```
src/
├── app/          Next.js App Router — én mappe per side/route
├── components/   React-komponenter, organiseret efter feature
├── context/      Globale React-contexts (auth, favoritter, køretøjer)
├── data/         Statiske konstanter og UI-tekster
├── hooks/        Custom React hooks, organiseret efter domæne
├── lib/          API-kald og hjælpefunktioner
├── types/        TypeScript-typer der bruges på tværs af filer
```

---

## Sådan sætter et API-kald sig sammen

```
side/komponent
    └── useQuery(QUERY_KEYS.xxx)
            └── *Api.ts (fetchXxx)
                    └── apiClient.ts (apiRequest)
                            └── NEXT_PUBLIC_API_BASE_URL
```

**`lib/apiClient.ts`** er det eneste sted der kalder `fetch()` mod vores backend.
Den sætter JWT-token på automatisk og redirecter til `/login` ved 401.

**`lib/queryKeys.ts`** samler alle React Query cache-nøgler ét sted — se den fil
for et hurtigt overblik over hvilke endpoints der bruges og hvad de returnerer.

---

## API-filer og deres endpoints

| Fil | Endpoints |
|-----|-----------|
| `lib/authApi.ts` | POST /auth/login, /auth/register, /auth/forgot-password, /auth/reset-password · PUT/DELETE /users/:id |
| `lib/locationsApi.ts` | GET /locations |
| `lib/carsApi.ts` | GET/POST /users/:id/cars · PUT/DELETE /cars/:id |
| `lib/subscriptionsApi.ts` | GET /users/:id/subscriptions · POST /subscriptions · DELETE /subscriptions/:id |
| `lib/washLogApi.ts` | GET /users/:id/washlogs |
| `lib/offersApi.ts` | GET /offers |
| `lib/equipmentApi.ts` | GET /equipment/:locationId (public — ingen JWT) |

---

## Hooks og hvad de dækker

Importer altid fra `@/hooks` (barrel export i `hooks/index.ts`).

| Hook | Formål |
|------|--------|
| `useAuth` | Login-session, token, bruger-objekt, login/logout |
| `useVehicles` | Brugerens køretøjer — CRUD |
| `useSubscriptions` | Brugerens abonnementer + `removeSubscription()` |
| `useReceiptHistory` | Vaskehistorik bygget af washLog + subscriptions + cars |
| `useLocationDetails` | Data + udstyr for én lokation (details-siden) |
| `useNearestLocation` | GPS + haversine-afstand til lokationer |
| `useFavorites` | Favoritter gemt i localStorage |
| `useUpdateProfile` | Formularlogik til profil-redigering |
| `useSubscriptionPayment` | Betalingstilstand til abonnementssiden |
| `useNavVisibility` | Skjul/vis bundnavigation (fx under aktiv vask) |
| `useClickOutside` | Luk dropdown ved klik uden for elementet |
| `useAnimatedToast` | Enter/exit-animationsfaser til toasts |
| `usePlanCarousel` | Planvalg og slide-retning (subscriptions + singlewash) |

---

## Globale contexts

| Context | Hvad den holder | Hvordan man bruger den |
|---------|-----------------|------------------------|
| `AuthContext` | JWT-token, bruger-objekt, isLoading | `useAuth()` |
| `VehiclesContext` | Brugerens biler (transformeret fra Car[]) | `useVehicles()` |
| `FavoritesContext` | Favorit-location-IDs i localStorage | `useFavorites()` |

Alle tre mountes i `components/layout/Providers.tsx` → `app/layout.tsx`.

---

## Data-mappen (statiske konstanter)

Filer i `data/` er rene konstanter — ingen API-kald, ingen state.

| Fil | Indhold |
|-----|---------|
| `data/vehicles/vehicleTypes.ts` | Biltyper (car, motorcycle, truck, bus) med ikon og label |
| `data/vehicles/plateFormats.ts` | Nummerpladeformat per land (regex, maske, placeholder) |
| `data/shared/countriesData.ts` | Europæiske lande + opkaldskoder (+45, +46 …) |
| `data/receipts/receiptHistory.ts` | UI-tekster til kvitteringssiden + localStorage-hjælper |
| `data/shared/supportData.ts` | Kundeservice-kort og FAQ-spørgsmål |
| `data/notifications/notificationData.ts` | Notifikationsindstillinger (standard-værdier) |
| `data/dashboard/dashboardData.ts` | Toast-tekster til dashboard |

---

## Nøgleregler

- **Alle backend-kald går gennem `apiRequest()`** i `lib/apiClient.ts`.
- **`lib/` importerer aldrig fra `components/`** — kun omvendt.
- **`QUERY_KEYS`** bruges konsekvent i alle `useQuery`-kald så cachen deles på tværs.
- **Hooks exporteres altid fra `@/hooks`**, ikke direkte fra den enkelte fil.
- **Ruter defineres i `lib/routes.ts`** — skriv aldrig URL-strenge direkte i koden.
