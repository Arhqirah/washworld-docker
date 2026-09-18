// BilerPage (cars/page.tsx) – oversigt over brugerens registrerede køretøjer.
// Viser hvert køretøj som et VehicleCard med nummerplade, status og dropdown-menu.

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import PageInfo from "@/components/shared/PageInfo";
import VehicleCard from "@/components/vehicles/VehicleCard";
import { useVehicles } from "@/hooks";
import { ROUTES } from "@/lib/routes";

export default function BilerPage() {
  const router = useRouter();
  const { vehicles, isLoading, error, deleteVehicle } = useVehicles();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deleteVehicle(id);
      setOpenMenuId(null);
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : "Kunne ikke slette køretøjet");
      setOpenMenuId(null);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="flex flex-col min-h-full">
      <PageInfo text="Dine køretøjer" />

      <main className="flex flex-col gap-4 px-6 pt-6 pb-8">
        {isLoading && (
          <p className="text-center text-sm font-semibold text-white">Henter køretøjer...</p>
        )}
        {error && (
          <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
        )}
        {deleteError && (
          <p className="rounded-sm bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{deleteError}</p>
        )}

        {!isLoading && !error && vehicles.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            menuOpen={openMenuId === vehicle.id}
            isDeleting={deletingId === vehicle.id}
            onMenuToggle={() => setOpenMenuId(openMenuId === vehicle.id ? null : vehicle.id)}
            onAddSubscription={() => {
              router.push(ROUTES.subscriptionForCar(vehicle.id));
              setOpenMenuId(null);
            }}
            onEdit={() => {
              setOpenMenuId(null);
              router.push(ROUTES.editCar(vehicle.id));
            }}
            onDelete={() => handleDelete(vehicle.id)}
            onCloseMenu={() => setOpenMenuId(null)}
          />
        ))}

        {!isLoading && !error && vehicles.length === 0 && (
          <p className="text-center text-sm font-semibold text-white">
            Du har ingen køretøjer endnu.
          </p>
        )}

        <Link
          href={ROUTES.addCar}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-[3px] bg-(--brand-green-01) py-3 text-xl font-bold text-white"
        >
          <Plus size={22} strokeWidth={3} />
          Tilføj bil
        </Link>
      </main>
    </div>
  );
}
