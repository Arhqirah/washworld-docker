// usePlanCarousel – styrer valg af plan (Guld/Premium/Brilliant) og kortets slide-animation.
// Bruges af subscriptions/page.tsx og singlewash/page.tsx til at skifte mellem planer.
//
// selectedIndex → indeks på det aktuelle plan i PLANS-arrayet (0=Guld, 1=Premium, 2=Brilliant)
// slideDirection → "right" hvis man vælger et højere plan, "left" hvis man går tilbage
// animKey → stiger ved hvert plansskifte så React remounterer div'en og CSS-animationen kører forfra
// selectPlan(index) → kald denne når brugeren klikker på en planfane

import { useState } from "react";

export function usePlanCarousel() {
  const [selectedIndex, setSelectedIndex] = useState(2);
  const [slideDirection, setSlideDirection] = useState<"right" | "left">("right");
  const [animKey, setAnimKey] = useState(0);

  function selectPlan(index: number) {
    if (index === selectedIndex) return;
    setSlideDirection(index > selectedIndex ? "right" : "left");
    setSelectedIndex(index);
    setAnimKey((k) => k + 1);
  }

  return { selectedIndex, slideDirection, animKey, selectPlan };
}
