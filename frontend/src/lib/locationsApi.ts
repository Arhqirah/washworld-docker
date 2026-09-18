import { apiRequest } from "@/lib/apiClient";
import type { MapLocation } from "@/types/location";

export type ApiLocationRow = {
  location_id: string;
  location_name: string;
  location_address: string;
  location_zipcode: string;
  location_coordinate_x: number;
  location_coordinate_y: number;
  location_open_hours: string;
};

export function formatLocationAddress(row: {
  location_address: string;
  location_zipcode: string;
}): string {
  const street = row.location_address.trim();
  const zip = row.location_zipcode.trim();
  if (street && zip) return `${street}, ${zip}`;
  return street || zip;
}

function mapApiRowToMapLocation(row: ApiLocationRow): MapLocation | null {
  const lng = Number(row.location_coordinate_x);
  const lat = Number(row.location_coordinate_y);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  const inDenmark = lng >= 7 && lng <= 16 && lat >= 54 && lat <= 58;
  if (!inDenmark) return null;

  const name = row.location_name?.trim();
  if (!name) return null;

  return {
    id: row.location_id,
    name,
    address: formatLocationAddress(row),
    coords: [lng, lat],
    openHours: row.location_open_hours?.trim() ?? "",
  };
}

export async function fetchLocations(): Promise<ApiLocationRow[]> {
  const data = await apiRequest<{ locations: ApiLocationRow[] }>("/api/locations");
  return data.locations;
}

export async function fetchMapLocations(): Promise<MapLocation[]> {
  const data = await apiRequest<{ locations: ApiLocationRow[] }>("/api/locations");
  return data.locations
    .map(mapApiRowToMapLocation)
    .filter((loc): loc is MapLocation => loc !== null);
}

export async function fetchLocationById(id: string): Promise<MapLocation | null> {
  const locations = await fetchMapLocations();
  return locations.find((loc) => loc.id === id) ?? null;
}
