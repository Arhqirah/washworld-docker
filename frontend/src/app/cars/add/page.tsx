"use client";

// TilfoejBilPage – tilføj et nyt køretøj via den delte VehicleForm-komponent.

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import VehicleForm from "@/components/vehicles/VehicleForm";
import { useVehicles } from "@/hooks";
import { ROUTES } from "@/lib/routes";

export default function TilfoejBilPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addVehicle } = useVehicles();
  const returnTo = searchParams.get("returnTo");

  return (
    <VehicleForm
      pageTitle="Dine køretøjer"
      submitLabel="Tilføj"
      submitIcon={<Plus size={22} strokeWidth={3} />}
      onSubmit={async (values) => {
        await addVehicle(values);
        router.push(returnTo ?? ROUTES.cars);
      }}
    />
  );
}
