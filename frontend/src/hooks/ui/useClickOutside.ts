// useClickOutside – lytter efter klik uden for et givet HTML-element og kalder en handler.
// Bruges til at lukke dropdown-menuer (VehicleCard i cars/page.tsx og SubscriptionRow i profiles/page.tsx)
// når brugeren klikker et andet sted på siden.
// ref: peger på det element man vil beskytte (fx en menu-div)
// handler: funktion der kaldes når der klikkes udenfor (fx () => setOpenMenuId(null))
// enabled: kan slå lytteren fra når menuen er lukket, så der ikke lyttes unødigt

import { type RefObject, useEffect } from "react";

export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, handler, enabled]);
}
