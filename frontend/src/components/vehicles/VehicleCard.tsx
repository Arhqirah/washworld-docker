"use client";

// VehicleCard – ét køretøjskort med nummerplade, abonnementsstatus og dropdown-menu.
// Dropdown lukkes ved klik udenfor via useClickOutside.

import { useRef, type ElementType } from "react";
import { Car, Motorbike, Truck, Bus, MoreVertical, BadgePlus, Pencil, Trash2 } from "lucide-react";

import { LicensePlate } from "@/components/shared/LicensePlate";
import StatusBadge from "@/components/vehicles/StatusBadge";
import { useClickOutside } from "@/hooks";
import type { VehicleType } from "@/types/api";
import type { Vehicle } from "@/context/VehiclesContext";

const VEHICLE_ICONS: Record<VehicleType, ElementType> = {
  car: Car,
  motorcycle: Motorbike,
  truck: Truck,
  bus: Bus,
};

export default function VehicleCard({
  vehicle,
  menuOpen,
  isDeleting,
  onMenuToggle,
  onAddSubscription,
  onEdit,
  onDelete,
  onCloseMenu,
}: {
  vehicle: Vehicle;
  menuOpen: boolean;
  isDeleting: boolean;
  onMenuToggle: () => void;
  onAddSubscription: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCloseMenu: () => void;
}) {
  const VehicleIcon = VEHICLE_ICONS[vehicle.vehicleType ?? "car"];
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, onCloseMenu, menuOpen);

  return (
    <article className="relative overflow-visible rounded-[3px] bg-(--white-white) shadow-md">
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-3">
          <VehicleIcon size={24} className="text-neutral-700" />
          <span className="text-lg font-bold text-neutral-800">{vehicle.name}</span>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Muligheder"
            onClick={onMenuToggle}
            disabled={isDeleting}
            className="flex h-8 w-8 items-center justify-center text-neutral-500 disabled:opacity-50"
          >
            <MoreVertical size={20} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-9 z-50 w-48 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black/10">
              <button
                type="button"
                onClick={onAddSubscription}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                <BadgePlus size={15} className="text-(--brand-green-01)" />
                Tilføj abonnement
              </button>
              <div className="h-px bg-neutral-200" />
              <button
                type="button"
                onClick={onEdit}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                <Pencil size={15} className="text-(--brand-green-01)" />
                Rediger
              </button>
              <div className="h-px bg-neutral-200" />
              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                <Trash2 size={15} />
                {isDeleting ? "Sletter..." : "Slet"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-3">
        <LicensePlate plate={vehicle.plate} countryCode={vehicle.countryCode} />
        <StatusBadge subscriptionName={vehicle.subscriptionName} />
      </div>
    </article>
  );
}
