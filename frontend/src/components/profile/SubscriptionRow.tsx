"use client";

// SubscriptionRow – én abonnementsrække i profil-listen med dropdown-menu til skift og opsigelse.
// Dropdown lukkes ved klik udenfor via useClickOutside.

import { useRef } from "react";
import Link from "next/link";
import { MoreVertical, ArrowLeftRight, XCircle } from "lucide-react";

import { useClickOutside } from "@/hooks";
import type { Subscription } from "@/types/api";
import { ROUTES } from "@/lib/routes";

function formatRenewalDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("da-DK");
}

function getSubscriptionCarLabel(sub: Subscription): string | null {
  if (!sub.car_id) return null;
  const name = sub.car_name?.trim();
  if (name) return name;
  if (sub.car_license_plate?.trim()) return sub.car_license_plate.trim();
  return null;
}

export default function SubscriptionRow({
  sub,
  menuOpen,
  onMenuToggle,
  onCloseMenu,
  onCancel,
}: {
  sub: Subscription;
  menuOpen: boolean;
  onMenuToggle: () => void;
  onCloseMenu: () => void;
  onCancel: () => void;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, onCloseMenu, menuOpen);

  const carLabel = getSubscriptionCarLabel(sub);

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-base font-bold text-neutral-800">{sub.subscriptions_name}</p>
        {carLabel && (
          <p className="mt-0.5 text-xs font-semibold text-neutral-600">{carLabel}</p>
        )}
        {sub.subscriptions_next_billing_date && (
          <p className="mt-0.5 text-xs font-semibold text-neutral-500">
            Fornyes d. {formatRenewalDate(sub.subscriptions_next_billing_date)}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            sub.subscriptions_status === "aktiv"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {sub.subscriptions_status === "aktiv" ? "Aktiv" : sub.subscriptions_status}
        </span>
        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-label="Abonnement muligheder"
            onClick={(e) => { e.stopPropagation(); onMenuToggle(); }}
            className="flex h-8 w-8 items-center justify-center text-neutral-500"
          >
            <MoreVertical size={20} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-50 w-48 overflow-hidden rounded-md bg-white shadow-xl ring-1 ring-black/10">
              <Link
                href={ROUTES.subscription}
                onClick={onCloseMenu}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                <ArrowLeftRight size={15} className="text-(--brand-green-01)" />
                Skift abonnement
              </Link>
              <div className="h-px bg-neutral-200" />
              <button
                type="button"
                onClick={onCancel}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                <XCircle size={15} />
                Opsig abonnement
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
