// DetailsPage (details/page.tsx) – viser detaljer om én vaskelokalitet.
// URL-parameter ?id= bruges til at hente lokationens data og udstyr.
//
// Siden er opdelt i tre dele:
//   1. Lokationsinfo – navn, adresse, åbningstider og favoritknap
//   2. Live Status – tæller ledige/optagede/ud-af-drift maskiner per type (vaskehal, støvsuger, vask-selv)
//   3. Maskinkort – vandret scrollbar liste per sektion, brugeren vælger én maskine før vask
//
// Navigationslogik ved "Start vask":
//   Støvsuger / vask-selv → /selfwash
//   Vaskehal + aktivt abonnement der dækker lokationen → /activewash
//   Vaskehal + abonnement der IKKE dækker lokationen → ConfirmModal → /singlewash
//   Vaskehal uden abonnement → /singlewash
//
// State-oversigt:
//   showCarPicker        → styrer om bil-vælger-bottomsheet er åben
//   cars                 → brugerens registrerede biler, hentes fra backend via useEffect
//   showLocationWarning  → styrer om advarsels-modal vises (abonnement dækker ikke lokationen)
//   pendingCar           → den bil brugeren valgte mens advarsels-modal er åben
//   openInfo             → hvilken udstyrssektion der viser dimensions-tooltip (null = ingen)

"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, Info } from "lucide-react";

import StartWashButton from "@/components/buttons/StartWashButton";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import MachineCard from "@/components/vehicles/MachineCard";
import CarPickerSheet from "@/components/wash/CarPickerSheet";
import {
  EQUIPMENT_SECTIONS,
  countEquipmentByType,
  equipmentByType,
  formatEquipmentTitle,
  normalizeEquipmentStatus,
  formatLiveStatus,
} from "@/lib/equipmentApi";
import { formatOpenHoursDisplay } from "@/lib/locationGeo";
import { useFavorites, useAuth, useLocationDetails, useSubscriptions } from "@/hooks";
import { fetchUserCars } from "@/lib/carsApi";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Car } from "@/types/api";
import { ROUTES } from "@/lib/routes";

export default function DetailsPage() {
  const searchParams = useSearchParams();
  const locationId = searchParams.get("id");
  const router = useRouter();

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const liked = locationId ? isFavorite(locationId) : false;

  const { location, equipment, loadStatus, loadError, selectedId, setSelectedId } =
    useLocationDetails(locationId);
  const { subscriptions: userSubscriptions } = useSubscriptions(user?.user_id);

  const [showCarPicker, setShowCarPicker] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [pendingCar, setPendingCar] = useState<Car | null>(null);
  const [openInfo, setOpenInfo] = useState<string | null>(null);

  const { data: cars = [] } = useQuery({
    queryKey: QUERY_KEYS.cars(user?.user_id ?? ""),
    queryFn: () => fetchUserCars(user!.user_id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  // Auto-åbn CarPickerSheet når bruger vender tilbage efter at have tilføjet bil
  useEffect(() => {
    if (searchParams.get("showPicker") === "1") {
      setShowCarPicker(true);
      router.replace(`/details?id=${locationId}`);
    }
  }, [searchParams, locationId, router]);

  // Bygger live-status array til den øverste statusrække – genberegnes kun når equipment ændres
  const liveStatusCounts = useMemo(
    () =>
      EQUIPMENT_SECTIONS.map((section) => ({
        liveStatusIcon: section.liveStatusIcon,
        liveStatusLabel: section.liveStatusLabel,
        counts: countEquipmentByType(equipment, section.type),
      })),
    [equipment],
  );

  // Finder den valgte maskine ud fra selectedId (format: "vaskehal-42") og returnerer titel + status
  // Bruges til at vise "Valgt: Vaskehal 3" og sætte status på StartWashButton
  const selectedItem = useMemo(() => {
    if (!selectedId || equipment.length === 0) return null;
    for (const section of EQUIPMENT_SECTIONS) {
      const prefix = `${section.type}-`;
      if (selectedId.startsWith(prefix)) {
        const equipId = selectedId.slice(prefix.length);
        const items = equipmentByType(equipment, section.type);
        const idx = items.findIndex((e) => String(e.location_equipment_id) === equipId);
        if (idx !== -1) {
          return {
            title: formatEquipmentTitle(section.titlePrefix, idx + 1),
            status: normalizeEquipmentStatus(items[idx].location_equipment_status),
          };
        }
      }
    }
    return null;
  }, [selectedId, equipment]);

  // Sender brugeren til singlewash-flowet med bil, nummerplade, lokation og valgt udstyr som URL-parametre
  // encodeURIComponent sikrer at specialtegn i nummerpladen ikke ødelægger URL'en
  function routeToSingleWash(car: Car) {
    router.push(
      `${ROUTES.singlewash}?plate=${encodeURIComponent(car.car_license_plate)}&carId=${encodeURIComponent(car.car_id)}&location=${encodeURIComponent(locationId ?? "")}&equipment=${encodeURIComponent(selectedId ?? "")}`,
    );
  }

  // Hovedlogik der afgør hvilken vaskeroute brugeren sendes til efter bilvalg
  function handleCarSelected(car: Car) {
    setShowCarPicker(false);
    // Tjek om brugeren valgte selvvask eller støvsuger – de har et andet flow end automatisk vaskehal
    const isSelfService =
      selectedId?.startsWith("stovsuger") || selectedId?.startsWith("vask_selv");

    if (isSelfService) {
      router.push(
        `${ROUTES.selfWash(locationId ?? "", selectedId ?? "")}&carId=${encodeURIComponent(car.car_id)}`,
      );
      return;
    }

    // Find aktivt abonnement for den valgte bil
    const carSub = userSubscriptions.find(
      (s) => s.car_id === car.car_id && s.subscriptions_status === "aktiv",
    );

    if (carSub) {
      // location_id null betyder abonnementet dækker alle lokationer
      const coversThisLocation = !carSub.location_id || carSub.location_id === locationId;
      if (!coversThisLocation) {
        setPendingCar(car);
        setShowLocationWarning(true);
        return;
      }
      router.push(ROUTES.startWashSubscription(locationId ?? "", selectedId ?? "", car.car_id));
    } else {
      routeToSingleWash(car);
    }
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <section className="relative z-10 h-12">
        <div className="relative inline-flex h-full min-w-45 items-center gap-3 bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
          <p className="whitespace-nowrap text-2xl font-bold text-white">
            {loadStatus === "loading" ? "Henter…" : (location?.name ?? "—")}
          </p>
          <button
            type="button"
            onClick={() => locationId && toggleFavorite(locationId)}
            aria-label={liked ? "Fjern fra favoritter" : "Tilføj til favoritter"}
            disabled={loadStatus !== "ready"}
          >
            <Star
              size={22}
              className={liked ? "fill-yellow-400 stroke-yellow-400" : "stroke-white/70"}
            />
          </button>
        </div>
      </section>

      <CarPickerSheet
        isOpen={showCarPicker}
        cars={cars}
        subscriptions={userSubscriptions}
        onSelect={handleCarSelected}
        onClose={() => setShowCarPicker(false)}
        returnTo={`/details?id=${locationId}&showPicker=1`}
      />

      {showLocationWarning && pendingCar && (
        <ConfirmModal
          title="Abonnement dækker ikke her"
          message="Dit abonnement er kun gyldigt på én WashWorld. En vask her vil blive kvitteret som en enkelt vask og koster ekstra."
          confirmLabel="Start enkelt vask"
          cancelLabel="Annuller"
          confirmClassName="flex-1 rounded-lg bg-(--brand-green-01) py-2.5 text-sm font-bold text-white"
          onConfirm={() => {
            setShowLocationWarning(false);
            routeToSingleWash(pendingCar);
            setPendingCar(null);
          }}
          onCancel={() => {
            setShowLocationWarning(false);
            setPendingCar(null);
          }}
        />
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <main className="space-y-6 px-6 py-5">
          {loadStatus === "error" && (
            <p className="text-center text-sm text-(--color-danger)">
              {loadError ?? "Kunne ikke indlæse lokationen."}
            </p>
          )}

          {loadStatus === "ready" && location && (
            <>
              <section className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-neutral-900">{location.address}</p>
                  <p className="text-sm text-neutral-900">Miljøvenlig bilvask</p>
                  <p className="text-sm text-neutral-900">ID: {location.id}</p>
                </div>
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-(--brand-green-01) text-sm font-bold text-neutral-800">
                  {formatOpenHoursDisplay(location.openHours)}
                </div>
              </section>

              <section>
                <h2 className="mb-2 font-bold text-neutral-900">Live Status</h2>
                <div className="flex items-center justify-around divide-x divide-neutral-200 rounded-[3px] bg-white py-3 shadow-sm">
                  {liveStatusCounts.map((s) => (
                    <div key={s.liveStatusLabel} className="flex flex-1 items-center justify-center gap-2">
                      <Image
                        src={s.liveStatusIcon}
                        alt={s.liveStatusLabel}
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                      <span className="text-sm font-bold text-neutral-700">
                        {formatLiveStatus(s.counts)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {EQUIPMENT_SECTIONS.map((section) => (
                <section key={section.type}>
                  <div className="relative mb-3">
                    <h2 className="flex items-center gap-1.5 text-xl font-bold text-neutral-900">
                      {section.label}
                      <button
                        type="button"
                        onClick={() => setOpenInfo(openInfo === section.type ? null : section.type)}
                        aria-label={`Vis dimensioner for ${section.label}`}
                        className="text-black"
                      >
                        <Info size={13} />
                      </button>
                    </h2>
                    {openInfo === section.type && (
                      <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-[3px] bg-white px-4 py-3 text-sm text-neutral-700 shadow-lg ring-1 ring-black/10">
                        <p className="font-semibold mb-1">Maks. køretøjsdimensioner</p>
                        <p>Højde: 2,6 m</p>
                        <p>Sidespejl til sidespejl: 2,58 m</p>
                      </div>
                    )}
                  </div>
                  <div className="carousel-scroll flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
                    {equipmentByType(equipment, section.type).map((item, idx) => {
                      const cardId = `${section.type}-${item.location_equipment_id}`;
                      const isSelected = selectedId === cardId;
                      return (
                        <MachineCard
                          key={item.location_equipment_id}
                          id={cardId}
                          image={section.image}
                          title={formatEquipmentTitle(section.titlePrefix, idx + 1)}
                          status={normalizeEquipmentStatus(item.location_equipment_status)}
                          selected={isSelected}
                          faded={selectedId !== null && !isSelected}
                          onSelect={setSelectedId}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}

              <div className="flex w-full items-center justify-center gap-3">
                <StartWashButton
                  onClick={() => setShowCarPicker(true)}
                  status={selectedItem?.status as "Ledig" | "Optaget" | "Ud af drift" | undefined}
                  noSelection={!selectedId}
                />
                {location && (
                  <Link
                    href={`${ROUTES.map}?locationId=${locationId}&lat=${location.coords[1]}&lng=${location.coords[0]}`}
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[3px] bg-white shadow-md"
                    title="Vis rute"
                  >
                    <Image
                      src="/Car1.png"
                      alt="Vis rute"
                      className="h-11 w-11 object-contain"
                      width={44}
                      height={44}
                    />
                  </Link>
                )}
              </div>
              {selectedItem && (
                <p className="text-center text-sm text-white">Valgt: {selectedItem.title}</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
