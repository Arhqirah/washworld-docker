// useAnimatedToast – styrer animationsfaserne for en toast-besked (pop-up notifikation).
// Bruges på dashboard/page.tsx (notifikationsklokken) og profiles/page.tsx (profilopdateret-besked).
//
// Faserne fungerer sådan her:
//   "idle"      → toasten er skjult
//   "pre-enter" → toasten er renderet men endnu ikke synlig (klar til CSS-transition)
//   "enter"     → toasten glider ind (CSS-klasse sættes på)
//   "exit"      → toasten glider ud igen
//
// trigger() starter hele sekvensen. enterMs = hvor lang tid den er synlig, totalMs = hvornår den fjernes helt.
// Bruges via: const { show, phase, trigger } = useAnimatedToast(enterMs, totalMs)
// CSS-klasserne "profile-update-toast-enter" og "profile-update-toast-exit" er defineret i globals.css

import { useRef, useState } from "react";

type ToastPhase = "idle" | "pre-enter" | "enter" | "exit";

export function useAnimatedToast(enterMs = 4960, totalMs = 5500) {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<ToastPhase>("idle");
  const timeoutsRef = useRef<number[]>([]);

  function trigger() {
    // Ryd tidligere timeouts så man kan udløse toasten igen uden at de overlapper
    timeoutsRef.current.forEach(window.clearTimeout);

    setShow(true);
    setPhase("pre-enter");

    timeoutsRef.current = [
      window.setTimeout(() => setPhase("enter"), 40),
      window.setTimeout(() => setPhase("exit"), enterMs),
      window.setTimeout(() => {
        setShow(false);
        setPhase("idle");
      }, totalMs),
    ];
  }

  return { show, phase, trigger };
}
