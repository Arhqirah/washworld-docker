"use client";

// RedigerBilPage – rediger et eksisterende køretøj via den delte VehicleForm-komponent.
// Finder køretøjet via id-parameteren fra URL'en; sender til /cars hvis det ikke findes.

import { useEffect } from "react";
import { Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import PageInfo from "@/components/shared/PageInfo";
import VehicleForm from "@/components/vehicles/VehicleForm";
import { useVehicles } from "@/hooks";
import { EUROPEAN_COUNTRIES } from "@/data/shared/countriesData";
import { ROUTES } from "@/lib/routes";

export default function RedigerBilPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { vehicles, isLoading, updateVehicle } = useVehicles();

  const vehicle = vehicles.find((v) => v.id === id);

  useEffect(() => {
    if (!isLoading && !vehicle) router.replace(ROUTES.cars);
  }, [isLoading, vehicle, router]);

  if (isLoading || !vehicle) {
    return (
      <div className="flex flex-col min-h-full">
        <PageInfo text="Rediger køretøj" />
        <main className="px-6 pt-8">
          <p className="text-center text-sm font-semibold text-white">Henter køretøj...</p>
        </main>
      </div>
    );
  }

  const initialCountry =
    EUROPEAN_COUNTRIES.find((c) => c.code === vehicle.countryCode) ?? EUROPEAN_COUNTRIES[0];

  return (
    <VehicleForm
      key={vehicle.id}
      pageTitle="Rediger køretøj"
      submitLabel="Gem"
      submitIcon={<Check size={22} strokeWidth={3} />}
      initialValues={{
        country: initialCountry,
        plate: vehicle.plate,
        nickname: vehicle.name,
        isEV: vehicle.isEV,
        vehicleType: vehicle.vehicleType ?? "car",
      }}
      onSubmit={async (values) => {
        await updateVehicle(vehicle.id, values);
        router.push(ROUTES.cars);
      }}
    />
  );
}
