// carsApi indeholder alle API-kald til brugerens biler (hent, opret, opdater, slet).
// Bruges udelukkende af VehiclesContext.tsx, som udstiller dataen via useVehicles()-hooken.
// Alle funktioner bruger apiRequest() fra apiClient, som håndterer token og fejl automatisk.

import { apiRequest } from "@/lib/apiClient";
import type { Car } from "@/types/api";

export async function fetchUserCars(userId: string): Promise<Car[]> {
  const data = await apiRequest<{ cars: Car[] }>(
    `/api/users/${encodeURIComponent(userId)}/cars`,
  );
  return data.cars;
}

export type CarWriteInput = {
  car_license_plate: string;
  car_name?: string;
  car_is_ev?: boolean;
  car_country_code?: string;
  car_vehicle_type?: string;
};

export async function createCar(
  userId: string,
  input: CarWriteInput,
): Promise<{ message: string; car: Car }> {
  return apiRequest(`/api/users/${encodeURIComponent(userId)}/cars`, {
    method: "POST",
    body: input,
  });
}

export async function updateCar(
  userId: string,
  carId: string,
  input: CarWriteInput,
): Promise<{ message: string }> {
  return apiRequest(
    `/api/users/${encodeURIComponent(userId)}/cars/${encodeURIComponent(carId)}`,
    { method: "PUT", body: input },
  );
}

export async function deleteCar(
  userId: string,
  carId: string,
): Promise<{ message: string }> {
  return apiRequest(
    `/api/users/${encodeURIComponent(userId)}/cars/${encodeURIComponent(carId)}`,
    { method: "DELETE" },
  );
}
