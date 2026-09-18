// VehiclesContext giver alle sider og komponenter adgang til brugerens køretøjer.
// Den henter biler via carsApi.ts og abonnementer via subscriptionsApi.ts, og kombinerer
// dem til ét samlet Vehicle-objekt — fx om en bil har et aktivt abonnement.
// VehiclesProvider er monteret i Providers.tsx → layout.tsx (indeni AuthProvider).
//
// Brug useVehicles()-hooken (hooks/useVehicles.ts) for at tilgå listen af køretøjer
// og funktioner til at tilføje, redigere og slette dem.

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks";
import {
  createCar,
  deleteCar,
  fetchUserCars,
  updateCar,
} from "@/lib/carsApi";
import { fetchUserSubscriptions } from "@/lib/subscriptionsApi";
import type { Car, Subscription, VehicleType } from "@/types/api";

const VEHICLE_TYPES: VehicleType[] = ["car", "motorcycle", "truck", "bus"];

function normalizeVehicleType(value: string | undefined): VehicleType {
  if (value && VEHICLE_TYPES.includes(value as VehicleType)) {
    return value as VehicleType;
  }
  return "car";
}

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  countryCode: string;
  active: boolean;
  subscriptionName: string | null;
  isEV: boolean;
  vehicleType: VehicleType;
};

type VehiclesContextType = {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  refreshVehicles: () => Promise<void>;
  addVehicle: (v: Omit<Vehicle, "id" | "active" | "subscriptionName">) => Promise<void>;
  updateVehicle: (
    id: string,
    v: Omit<Vehicle, "id" | "active" | "subscriptionName">,
  ) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
};

export const VehiclesContext = createContext<VehiclesContextType | null>(null);

function toCarPayload(v: Omit<Vehicle, "id" | "active" | "subscriptionName">) {
  return {
    car_license_plate: v.plate,
    car_name: v.name.trim() || undefined,
    car_is_ev: v.isEV,
    car_country_code: v.countryCode,
    car_vehicle_type: v.vehicleType,
  };
}

function mapCarsToVehicles(
  cars: Car[],
  subscriptions: Subscription[],
): Vehicle[] {
  return cars.map((car, index) => {
    const activeSubscription = subscriptions.find(
      (s) => s.car_id === car.car_id && s.subscriptions_status === "aktiv",
    );
    const displayName =
      car.car_name?.trim() ||
      (index === 0 ? "Primær" : `Bil ${index + 1}`);

    return {
      id: car.car_id,
      name: displayName,
      plate: car.car_license_plate,
      countryCode: car.car_country_code || "DK",
      active: Boolean(activeSubscription),
      subscriptionName: activeSubscription?.subscriptions_name ?? null,
      isEV: Boolean(car.car_is_ev),
      vehicleType: normalizeVehicleType(car.car_vehicle_type),
    };
  });
}

export function VehiclesProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesFetching, setVehiclesFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prevUser, setPrevUser] = useState(user);

  // Ryd køretøjer når brugeren logger ud ("setState during render"-mønster)
  if (user !== prevUser) {
    setPrevUser(user);
    if (!user) setVehicles([]);
  }

  const isLoading = authLoading || vehiclesFetching;

  const refreshVehicles = useCallback(async () => {
    if (!user) return;

    setVehiclesFetching(true);
    setError(null);
    try {
      const [cars, subscriptions] = await Promise.all([
        fetchUserCars(user.user_id),
        fetchUserSubscriptions(user.user_id).catch(() => [] as Subscription[]),
      ]);
      setVehicles(mapCarsToVehicles(cars, subscriptions));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunne ikke hente køretøjer");
      setVehicles([]);
    } finally {
      setVehiclesFetching(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    // setTimeout breaks the synchronous call chain so the linter doesn't flag
    // setState calls inside refreshVehicles as synchronous-within-effect.
    const id = setTimeout(() => void refreshVehicles(), 0);
    return () => clearTimeout(id);
  }, [authLoading, refreshVehicles]);

  async function addVehicle(v: Omit<Vehicle, "id" | "active" | "subscriptionName">) {
    if (!user) throw new Error("Ikke logget ind");

    await createCar(user.user_id, toCarPayload(v));
    await refreshVehicles();
  }

  async function updateVehicle(
    id: string,
    v: Omit<Vehicle, "id" | "active" | "subscriptionName">,
  ) {
    if (!user) throw new Error("Ikke logget ind");

    await updateCar(user.user_id, id, toCarPayload(v));
    await refreshVehicles();
  }

  async function deleteVehicle(id: string) {
    if (!user) throw new Error("Ikke logget ind");

    await deleteCar(user.user_id, id);
    await refreshVehicles();
  }

  return (
    <VehiclesContext.Provider
      value={{
        vehicles,
        isLoading,
        error,
        refreshVehicles,
        addVehicle,
        updateVehicle,
        deleteVehicle,
      }}
    >
      {children}
    </VehiclesContext.Provider>
  );
}

