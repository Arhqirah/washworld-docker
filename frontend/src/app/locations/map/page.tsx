// Kortsiden – viser alle WashWorld-lokationer på et interaktivt kort.
// Suspense bruges fordi Map-komponenten bruger useSearchParams() som kræver det i Next.js.
// Al kortlogik håndteres af Map-komponenten.
import Map from '@/components/map/Map'
import { Suspense } from "react";

export default function MapPage() {
  return (
    <Suspense fallback={<div>Indlæser kort…</div>}>
      <Map />
    </Suspense>
  );
}