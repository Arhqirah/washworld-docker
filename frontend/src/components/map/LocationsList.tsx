// LocationsList – liste over alle WashWorld-vaskelokationer sorteret efter afstand til brugeren.
// Henter lokationer fra API'et og brugerens GPS-position (én gang ved indlæsning),
// beregner afstand med Haversine-formlen og viser lokationerne som kort i en scrollbar liste.

"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { MapLocation } from "@/types/location";
import { fetchMapLocations } from "@/lib/locationsApi";
import { QUERY_KEYS } from "@/lib/queryKeys";
import LocationPopupCard from "@/components/map/LocationPopupCard";
import { formatKmDa, haversineKm } from "@/lib/locationGeo";
import ViewToggle from "@/components/map/ViewToggle";

type LocationWithDistance = MapLocation & { distanceKm: number | null };

// Tilføjer afstandsfeltet til alle lokationer og sorterer dem nærmest-først.
// Lokationer uden GPS-data (userCoords er null) sorteres alfabetisk i stedet.
function sortByNearest(
  locations: MapLocation[],
  userCoords: [number, number] | null,
): LocationWithDistance[] {
  const withDistance: LocationWithDistance[] = locations.map((loc) => ({
    ...loc,
    distanceKm: userCoords ? haversineKm(userCoords, loc.coords) : null,
  }));

  return withDistance.sort((a, b) => {
    if (a.distanceKm === null && b.distanceKm === null) {
      return a.name.localeCompare(b.name, "da");
    }
    if (a.distanceKm === null) return 1;
    if (b.distanceKm === null) return -1;
    return a.distanceKm - b.distanceKm;
  });
}

export default function LocationsList() {
  const { data: locations = [], isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.locations(),
    queryFn: fetchMapLocations,
    staleTime: 1000 * 60 * 5,
  });

  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords([pos.coords.longitude, pos.coords.latitude]);
      },
      () => {
        setUserCoords(null);
      },
      { enableHighAccuracy: false, maximumAge: 120_000, timeout: 12_000 },
    );
  }, []);

  const sortedLocations = useMemo(
    () => sortByNearest(locations, userCoords),
    [locations, userCoords],
  );

  return (
    <>

      <header className="px-5 pt-4">
        <div className="mb-3">
          <ViewToggle />
        </div>
        <h1 className="text-lg font-bold text-black">Vaskehaller</h1>
        <p className="mt-1 text-sm text-black/60">
          {userCoords
            ? "Sorteret efter afstand"
            : "Tillad placering for at sortere efter afstand"}
        </p>
      </header>

      {isLoading ? (
        <p className="px-5 py-12 text-center text-[0.95rem] text-black/70">
          Henter lokationer…
        </p>
      ) : null}

      {isError ? (
        <p className="px-5 py-12 text-center text-[0.95rem] text-(--color-danger)">
          {error instanceof Error ? error.message : "Kunne ikke indlæse lokationer."}
        </p>
      ) : null}

      {!isLoading && !isError ? (
        <ul className="space-y-3 px-5 py-4">
          {sortedLocations.length === 0 ? (
            <li className="py-8 text-center text-sm text-black/60">
              Ingen lokationer fundet.
            </li>
          ) : (
            sortedLocations.map((loc) => (
              <li key={loc.id} className="washworld-location-list-item">
                <LocationPopupCard
                  locationId={loc.id}
                  name={loc.name}
                  address={loc.address}
                  openHours={loc.openHours}
                  distanceLabel={
                    loc.distanceKm !== null
                      ? formatKmDa(loc.distanceKm)
                      : "— km"
                  }
                />
              </li>
            ))
          )}
        </ul>
      ) : null}
    </>
  );
}
