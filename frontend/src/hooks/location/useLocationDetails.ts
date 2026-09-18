// useLocationDetails – henter lokationsdata og udstyrsstatus for én vaskelokalitet.
// Bruges på details/page.tsx til at vise adresse, åbningstider, maskiner og live-status.
//
// To queries:
//   1. QUERY_KEYS.location(id)          → navn, adresse, åbningstider
//   2. QUERY_KEYS.locationEquipment(id) → maskiner med status (kører kun hvis lokation findes)
//
// selectedId styrer hvilken maskine der er valgt (format: "{type}-{equipment_id}").
// Nulstilles automatisk når locationId skifter.

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { fetchLocationEquipment, type LocationEquipment } from "@/lib/equipmentApi";
import { fetchLocationById } from "@/lib/locationsApi";

export function useLocationDetails(locationId: string | null) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedId(null);
  }, [locationId]);

  const {
    data: location = null,
    isLoading: locationLoading,
    isError: locationFailed,
    error: locationErr,
  } = useQuery({
    queryKey: QUERY_KEYS.location(locationId ?? ""),
    queryFn: () => fetchLocationById(locationId!),
    enabled: !!locationId,
    staleTime: 1000 * 60 * 5,
  });

  const { data: equipment = [] } = useQuery<LocationEquipment[]>({
    queryKey: QUERY_KEYS.locationEquipment(locationId ?? ""),
    queryFn: () => fetchLocationEquipment(locationId!),
    enabled: !!locationId && !!location,
    staleTime: 1000 * 60 * 5,
  });

  const loadStatus = !locationId
    ? "error"
    : locationLoading
      ? "loading"
      : locationFailed || location === null
        ? "error"
        : "ready";

  const loadError = !locationId
    ? "Manglende lokations-id"
    : locationFailed
      ? (locationErr instanceof Error ? locationErr.message : "Ukendt fejl")
      : !locationLoading && location === null
        ? "Lokationen blev ikke fundet"
        : null;

  return { location, equipment, loadStatus, loadError, selectedId, setSelectedId };
}
