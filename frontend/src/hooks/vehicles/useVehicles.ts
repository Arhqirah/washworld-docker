// useVehicles er en hjælpefunktion (hook) der giver nem adgang til køretøjslisten fra VehiclesContext.tsx.
// VehiclesContext henter data via carsApi.ts og subscriptionsApi.ts og er monteret i Providers.tsx.
import { useContext } from "react";
import { VehiclesContext } from "@/context/VehiclesContext";

// Returnerer vehicles[], isLoading, addVehicle(), updateVehicle() og deleteVehicle().
// Bruges i: cars/page.tsx, cars/add/page.tsx, cars/edit/[id]/page.tsx,
// abonnement/handlesubscription/page.tsx, dashboard/page.tsx og singlewash/page.tsx.
export function useVehicles() {
  const ctx = useContext(VehiclesContext);
  if (!ctx) throw new Error("useVehicles must be used within VehiclesProvider");
  return ctx;
}
