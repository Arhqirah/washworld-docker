// CountrySelector – dropdown til at vælge land ved registrering af telefonnummer.
// Viser alle europæiske lande med landekode (DK, SE osv.) og tilhørende opkaldskode (+45, +46 osv.).
// Lukker automatisk når brugeren klikker uden for dropdown-listen.

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { type Country, EUROPEAN_COUNTRIES } from "@/data/shared/countriesData";

export type { Country };
export { EUROPEAN_COUNTRIES };

export default function CountrySelector({
  value,
  onChange,
}: {
  value: Country;
  onChange: (country: Country) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-[3px] border border-neutral-400 bg-(--white-white) px-3 py-3.5 text-base font-bold text-neutral-700 shadow-sm"
      >
        {value.code}
        <ChevronDown size={14} className={`text-neutral-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-60 w-44 overflow-y-auto rounded-[3px] bg-white shadow-xl ring-1 ring-black/10">
          {EUROPEAN_COUNTRIES.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                onChange(country);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100 ${
                country.code === value.code
                  ? "text-(--brand-green-01)"
                  : "text-neutral-700"
              }`}
            >
              <span className="font-bold">{country.code}</span>
              <span className="text-xs text-neutral-500">{country.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
