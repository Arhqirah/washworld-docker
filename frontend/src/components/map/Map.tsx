// Map – kortkomponenten der bruger Mapbox GL til at vise alle WashWorld-vaskelokationer på et interaktivt kort.
// Henter lokationer fra API'et, sporer brugerens GPS-position og tegner en kørende rute til en valgt destination.
// Dag/nat-lystema kan skiftes med knappen i hjørnet. Rute-panelet i bunden viser vejvisning trin for trin.

"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpLeft,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Navigation,
  RotateCcw,
} from "lucide-react";
import MapControls from "./MapControls";
import ViewToggle from "./ViewToggle";
import { ROUTES } from "@/lib/routes";
import type { MapLocation } from "@/types/location";
import { fetchMapLocations } from "@/lib/locationsApi";
import { QUERY_KEYS } from "@/lib/queryKeys";
import {
  formatKmDa,
  formatOpenHoursDisplay,
  haversineKm,
  locationShortName,
} from "@/lib/locationGeo";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type LightPreset = "day" | "night";

type RouteStep = {
  instruction: string;
  distanceM: number;
  maneuverType: string;
  maneuverModifier?: string;
};

type RouteInfo = {
  steps: RouteStep[];
  totalDistanceM: number;
  totalDurationS: number;
};

// Formaterer en afstand i meter til dansk tekst: under 1 km vises i meter, ellers i km.
function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
}

// Formaterer en varighed i sekunder til dansk tekst: fx "12 min" eller "1 t 5 min".
function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} t` : `${h} t ${m} min`;
}

// Viser det rette pil-ikon til et vejvisnings-trin baseret på manøvretype og retning.
function StepIcon({ type, modifier }: { type: string; modifier?: string }) {
  if (type === "depart") return <Navigation className="h-4 w-4" />;
  if (type === "arrive") return <MapPin className="h-4 w-4" />;
  switch (modifier) {
    case "left":
    case "sharp left": return <ArrowLeft className="h-4 w-4" />;
    case "right":
    case "sharp right": return <ArrowRight className="h-4 w-4" />;
    case "slight left": return <ArrowUpLeft className="h-4 w-4" />;
    case "slight right": return <ArrowUpRight className="h-4 w-4" />;
    case "uturn": return <RotateCcw className="h-4 w-4" />;
    default: return <ArrowUp className="h-4 w-4" />;
  }
}

// Sikrer tekst mod XSS ved at erstatte HTML-specialtegn inden de indsættes i popup-HTML.
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Opretter et WashWorld SVG-pin-element der bruges som markør for vaskelokationer på kortet.
function createPrimaryPin(): HTMLImageElement {
  const img = document.createElement("img");
  img.src = "/washworld-pin.svg";
  img.alt = "";
  img.width = 28;
  img.height = 28;
  return img;
}

// Opretter en blå pulserende cirkel der viser brugerens aktuelle GPS-position på kortet.
function createUserLocationPin(): HTMLDivElement {
  const el = document.createElement("div");
  el.className = "washworld-user-location-pin";
  return el;
}

// Opretter brugerens positionsmarkør første gang, og flytter den ved efterfølgende GPS-opdateringer.
function updateUserLocationMarker(
  map: mapboxgl.Map,
  markerRef: MutableRefObject<mapboxgl.Marker | null>,
  lngLat: [number, number],
): void {
  if (!markerRef.current) {
    markerRef.current = new mapboxgl.Marker({
      element: createUserLocationPin(),
      anchor: "center",
    })
      .setLngLat(lngLat)
      .addTo(map);
    return;
  }
  markerRef.current.setLngLat(lngLat);
}

// Sætter en klik-lytter på "Se mere"-linket i en popup så det åbner detaljesiden via React Router i stedet for en fuld side-genindlæsning.
function bindDetailsLink(
  popup: mapboxgl.Popup,
  locationId: string,
  onOpenDetails: (locationId: string) => void,
): void {
  const link = popup.getElement()?.querySelector(".washworld-popup-more");
  if (!link) return;

  link.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    onOpenDetails(locationId);
  });
}

function bindRouteButton(
  popup: mapboxgl.Popup,
  locCoords: [number, number],
  onRoute: (coords: [number, number]) => void,
): void {
  const btn = popup.getElement()?.querySelector(".washworld-popup-route");
  if (!btn) return;

  btn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    popup.remove();
    onRoute(locCoords);
  });
}

// Tilføjer et WashWorld-pin til kortet for hver lokation. Klik åbner en popup med navn, adresse, afstand og åbningstider.
function addLocationMarkers(
  map: mapboxgl.Map,
  locations: MapLocation[],
  getUserLngLat: () => [number, number] | null,
  onOpenDetails: (locationId: string) => void,
  onRoute: (coords: [number, number]) => void,
): void {
  let activePopup: mapboxgl.Popup | null = null;
  let isMarkerFlyTo = false;

  const closeActivePopup = () => {
    if (!activePopup) return;
    activePopup.remove();
    activePopup = null;
  };

  map.on("click", closeActivePopup);
  map.on("zoomstart", () => {
    if (isMarkerFlyTo) return;
    closeActivePopup();
  });
  map.on("moveend", () => {
    isMarkerFlyTo = false;
  });

  locations.forEach((loc) => {
    const popup = new mapboxgl.Popup({
      offset: 20,
      maxWidth: "400px",
      className: "washworld-popup",
      closeOnClick: true,
      closeOnMove: false,
    });

    const marker = new mapboxgl.Marker({
      element: createPrimaryPin(),
      anchor: "center",
    })
      .setLngLat(loc.coords)
      .addTo(map);

    marker.getElement().addEventListener("click", (event) => {
      event.stopPropagation();
      closeActivePopup();

      const user = getUserLngLat();
      const distancePart = user
        ? formatKmDa(haversineKm(user, loc.coords))
        : "— km";
      const hours = escapeHtml(formatOpenHoursDisplay(loc.openHours));
      const shortName = escapeHtml(locationShortName(loc.name));
      const addressHtml = escapeHtml(loc.address);

      popup
        .setHTML(
          `
          <div class="washworld-popup-card">
            <h4 class="washworld-popup-title">
              ${shortName} • <span class="washworld-popup-distance">${distancePart}</span>
            </h4>
            <p class="washworld-popup-address">${addressHtml}</p>
            <div class="washworld-popup-footer">
              <p class="washworld-popup-hours">
                <span class="washworld-popup-hours-accent">Åben</span>
                ${hours}
              </p>
              <div class="washworld-popup-actions">
                <button class="washworld-popup-route">Vis rute</button>
                <a href="/details?id=${encodeURIComponent(loc.id)}" class="washworld-popup-more">Se mere</a>
              </div>
            </div>
          </div>
        `,
        )
        .setLngLat(loc.coords)
        .addTo(map);
      bindDetailsLink(popup, loc.id, onOpenDetails);
      bindRouteButton(popup, loc.coords, onRoute);
      activePopup = popup;

      isMarkerFlyTo = true;
      map.flyTo({ center: loc.coords, zoom: 12 });
    });
  });
}

// Zoomer og centrer kortet så alle vaskelokationer er synlige på én gang ved første indlæsning.
function fitMapToLocations(map: mapboxgl.Map, locations: MapLocation[]): void {
  if (locations.length === 0) return;
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => bounds.extend(loc.coords));
  map.fitBounds(bounds, { padding: 56, maxZoom: 8.5 });
}

// Henter en kørende rute fra Mapbox Directions API og tegner den som en grøn linje på kortet.
// Returnerer rutens trin, samlet afstand og estimeret køretid.
async function drawRoute(
  map: mapboxgl.Map,
  from: [number, number],
  to: [number, number],
): Promise<RouteInfo | null> {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?geometries=geojson&steps=true&language=da&access_token=${mapboxgl.accessToken}`;

  const res = await fetch(url);
  const json = await res.json();
  const route = json.routes?.[0];
  if (!route) return null;

  if (map.getSource("route")) {
    (map.getSource("route") as mapboxgl.GeoJSONSource).setData(route.geometry);
  } else {
    map.addSource("route", { type: "geojson", data: route.geometry });
    map.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#00b140",
        "line-width": 5,
        "line-opacity": 0.85,
      },
    });
  }

  const steps: RouteStep[] = (route.legs?.[0]?.steps ?? []).map((step: any) => ({
    instruction: step.maneuver.instruction,
    distanceM: step.distance,
    maneuverType: step.maneuver.type,
    maneuverModifier: step.maneuver.modifier,
  }));

  return {
    steps,
    totalDistanceM: route.distance,
    totalDurationS: route.duration,
  };
}

export default function Map() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const destLat = searchParams.get("lat");
  const destLng = searchParams.get("lng");

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userLngLatRef = useRef<[number, number] | null>(null);
  const routeDrawnRef = useRef(false);

  const [lightPreset, setLightPreset] = useState<LightPreset>("day");
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  const { data: locations = [], isLoading, isError, error } = useQuery({
    queryKey: QUERY_KEYS.locations(),
    queryFn: fetchMapLocations,
    staleTime: 1000 * 60 * 5,
  });
  const [routePanelOpen, setRoutePanelOpen] = useState(true);
  const [locationStatus, setLocationStatus] = useState<"pending" | "ok" | "error">(
    () => (typeof navigator !== "undefined" && !navigator.geolocation) ? "error" : "pending",
  );

  useEffect(() => {
    const orig = Element.prototype.releasePointerCapture;
    Element.prototype.releasePointerCapture = function (pointerId) {
      try { orig.call(this, pointerId); } catch { /* mapbox-gl throws NotFoundError on fast drags */ }
    };
    return () => { Element.prototype.releasePointerCapture = orig; };
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;

    let locationOk = false;

    function onLocationSuccess(pos: GeolocationPosition) {
      const lngLat: [number, number] = [pos.coords.longitude, pos.coords.latitude];
      userLngLatRef.current = lngLat;
      if (!locationOk) {
        locationOk = true;
        setLocationStatus("ok");
      }
      const map = mapRef.current;
      if (!map) return;
      updateUserLocationMarker(map, userMarkerRef, lngLat);
      if (destLat && destLng && !routeDrawnRef.current && map.isStyleLoaded()) {
        const to: [number, number] = [parseFloat(destLng), parseFloat(destLat)];
        routeDrawnRef.current = true;
        drawRoute(map, lngLat, to).then((info) => {
          if (info) { setRouteInfo(info); }
          const bounds = new mapboxgl.LngLatBounds().extend(lngLat).extend(to);
          map.fitBounds(bounds, { padding: 80 });
        });
      }
    }

    // Forsøg med høj nøjagtighed (GPS på mobil), fald tilbage til lav nøjagtighed
    // (WiFi/netværk) hvis det fejler — typisk på desktop uden GPS.
    // watchPosition giver løbende opdateringer så markøren følger med.
    let watchId: number | null = null;

    const startWatch = (highAccuracy: boolean) => {
      watchId = navigator.geolocation.watchPosition(
        onLocationSuccess,
        () => {
          if (highAccuracy) {
            if (watchId !== null) navigator.geolocation.clearWatch(watchId);
            startWatch(false);
          } else {
            userLngLatRef.current = null;
            setLocationStatus("error");
          }
        },
        {
          enableHighAccuracy: highAccuracy,
          maximumAge: 0,
          timeout: 10_000,
        },
      );
    };

    startWatch(true);

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [destLat, destLng]);

  useEffect(() => {
    if (isLoading || isError) return;
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      attributionControl: false,
      config: { basemap: { theme: "monochrome", lightPreset } },
      center: [12.5683, 55.6761],
      zoom: 6,
    });
    mapRef.current = map;

    map.addControl(new mapboxgl.NavigationControl());

    map.on("load", () => {
      addLocationMarkers(
        map,
        locations,
        () => userLngLatRef.current,
        (locationId) => router.push(ROUTES.details(locationId)),
        (locCoords) => {
          const userPos = userLngLatRef.current;
          if (!userPos) return;
          drawRoute(map, userPos, locCoords).then((info) => {
            if (info) setRouteInfo(info);
            const bounds = new mapboxgl.LngLatBounds().extend(userPos).extend(locCoords);
            map.fitBounds(bounds, { padding: 80 });
          });
        },
      );

      if (userLngLatRef.current) {
        updateUserLocationMarker(map, userMarkerRef, userLngLatRef.current);
      }

      // Tegn rute hvis vi kom fra dashboard med en destination
      if (destLat && destLng && userLngLatRef.current && !routeDrawnRef.current) {
        const to: [number, number] = [parseFloat(destLng), parseFloat(destLat)];
        routeDrawnRef.current = true;

        drawRoute(map, userLngLatRef.current, to).then((info) => {
          if (info) {
            setRouteInfo(info);
          }
          const bounds = new mapboxgl.LngLatBounds()
            .extend(userLngLatRef.current!)
            .extend(to);
          map.fitBounds(bounds, { padding: 80 });
        });
      } else {
        fitMapToLocations(map, locations);
      }
    });

    return () => {
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, [isLoading, isError, locations, destLat, destLng]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setConfigProperty("basemap", "lightPreset", lightPreset);
  }, [lightPreset]);

  const cycleLightPreset = () => {
    setLightPreset((current) => (current === "day" ? "night" : "day"));
  };

  const centerOnUser = () => {
    const map = mapRef.current;
    if (!map || !navigator.geolocation) return;

    const focus = (lngLat: [number, number]) => {
      userLngLatRef.current = lngLat;
      updateUserLocationMarker(map, userMarkerRef, lngLat);
      map.flyTo({ center: lngLat, zoom: 13, duration: 700 });
    };

    if (userLngLatRef.current) {
      focus(userLngLatRef.current);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => focus([pos.coords.longitude, pos.coords.latitude]),
      () => {},
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15_000 },
    );
  };

  const overlayStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.85)",
    zIndex: 2,
    fontSize: "0.95rem",
    padding: "1rem",
    textAlign: "center",
  };

  return (
    <div style={{ width: "100%", height: "calc(120dvh - 112px)", position: "relative" }}>
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10 }}>
        <ViewToggle />
      </div>
      <MapControls
        lightPreset={lightPreset}
        onCycleLightPreset={cycleLightPreset}
        onCenterOnUser={centerOnUser}
      />
      {isLoading && (
        <div style={overlayStyle}>Henter lokationer…</div>
      )}
      {isError && (
        <div style={overlayStyle}>
          <span>{error instanceof Error ? error.message : "Kunne ikke indlæse kortet."}</span>
        </div>
      )}
      <div
        ref={mapContainer}
        className="washworld-map"
        style={{
          width: "100%",
          height: "100%",
          visibility: (!isLoading && !isError) ? "visible" : "hidden",
        }}
      />

      {destLat && destLng && locationStatus === "error" && !routeInfo && (
        <div className="absolute bottom-0 left-0 right-0 z-10 rounded-t-lg bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.18)]">
          <p className="text-sm font-bold text-black">Kunne ikke hente din lokation</p>
          <p className="mt-1 text-xs text-gray-500">
            Tillad lokationsadgang i din browser og prøv igen.
          </p>
        </div>
      )}

      {routeInfo && routeInfo.steps[0] && typeof document !== "undefined" && (() => {
        const target = document.querySelector(".app-screen");
        if (!target) return null;
        return createPortal(
          <div className="absolute bottom-22 left-0 right-0 z-20 overflow-hidden bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">
            <button
              type="button"
              onClick={() => setRoutePanelOpen((o) => !o)}
              className="flex w-full items-center justify-center py-1.5"
              aria-label={routePanelOpen ? "Skjul vejvisning" : "Vis vejvisning"}
            >
              {routePanelOpen ? (
                <ChevronDown className="h-4 w-4 text-black/30" />
              ) : (
                <ChevronUp className="h-4 w-4 text-black/30" />
              )}
            </button>

            {routePanelOpen && (
              <>
                <div className="flex items-center gap-3 px-4 pb-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] bg-(--brand-green-01) text-white">
                    <StepIcon type={routeInfo.steps[0].maneuverType} modifier={routeInfo.steps[0].maneuverModifier} />
                  </div>
                  <span className="flex-1 text-sm font-semibold leading-snug text-black">
                    {routeInfo.steps[0].instruction}
                  </span>
                  {routeInfo.steps[0].distanceM > 0 && (
                    <span className="shrink-0 text-sm font-bold text-black/40">
                      {formatDistance(routeInfo.steps[0].distanceM)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 border-t border-black/10 px-4 py-2">
                  <div className="flex h-7 items-center rounded-[3px] bg-(--brand-green-01) px-2.5">
                    <span className="text-xs font-bold text-white">{formatDuration(routeInfo.totalDurationS)}</span>
                  </div>
                  <span className="text-xs font-semibold text-black/40">{formatDistance(routeInfo.totalDistanceM)} i alt</span>
                </div>
              </>
            )}

            {!routePanelOpen && (
              <div className="flex items-center gap-2 px-4 pb-2">
                <div className="flex h-7 items-center rounded-[3px] bg-(--brand-green-01) px-2.5">
                  <span className="text-xs font-bold text-white">{formatDuration(routeInfo.totalDurationS)}</span>
                </div>
                <span className="text-xs font-semibold text-black/40">{formatDistance(routeInfo.totalDistanceM)} i alt</span>
              </div>
            )}
          </div>,
          target,
        );
      })()}
    </div>
  );
}