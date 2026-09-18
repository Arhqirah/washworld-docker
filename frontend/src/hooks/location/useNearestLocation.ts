// useNearestLocation – bruger browserens geolocation API til at finde den nærmeste vaskehal.
// Bruges på dashboard/page.tsx til at vise "Nærmeste vaskehal"-kortet og favorit-karussel med afstande.
//
// Tager en liste af lokationer (fra fetchLocations via TanStack Query) og beregner afstanden
// til hver enkelt ved hjælp af haversineKm() fra locationGeo.ts (jordens krumning indregnet).
// Lokationerne returneres sorteret nærmest-først med en "distance"-streng, fx "3,2 km".
//
// Returnerer:
//   nearestLocation  → den nærmeste lokation (eller null mens GPS hentes / ved fejl)
//   locationsWithDistance → alle lokationer beriget med afstandsstreng, sorteret

import { useEffect, useState } from "react";
import { haversineKm } from "@/lib/locationGeo";
import type { ApiLocationRow } from "@/lib/locationsApi";

export type LocationWithDistance = ApiLocationRow & { distance: string };

export function useNearestLocation(locations: ApiLocationRow[]) {
  const [nearestLocation, setNearestLocation] = useState<LocationWithDistance | null>(null);
  const [locationsWithDistance, setLocationsWithDistance] = useState<LocationWithDistance[]>([]);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    if (!locations.length || !navigator.geolocation) {
      setLocationError(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationError(false); // Ryd fejl sat af en tidligere tom-lokations-kørsel
        const { latitude, longitude } = pos.coords;

        const withDistances: LocationWithDistance[] = locations
          .map((loc) => {
            const km = haversineKm(
              [longitude, latitude],
              [loc.location_coordinate_x, loc.location_coordinate_y],
            );
            return { ...loc, distance: `${km.toFixed(1)} km` };
          })
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

        setLocationsWithDistance(withDistances);
        setNearestLocation(withDistances[0] ?? null);
      },
      () => setLocationError(true),
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 10_000 },
    );
  }, [locations]);

  return { nearestLocation, locationsWithDistance, locationError };
}
