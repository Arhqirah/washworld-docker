"use client";

// PhoneInput – kombineret landekode-dropdown og telefonnummer-felt med inline fejlbesked.
// Klikkes der uden for dropdownen lukkes den automatisk via en mousedown-listener.

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { EUROPEAN_COUNTRIES, PHONE_DIAL_CODES } from "@/data/shared/countriesData";

type PhoneInputProps = {
  label: string;
  dialCode: string;
  localPhone: string;
  error: string | null;
  onDialCodeChange: (code: string) => void;
  onLocalPhoneChange: (val: string) => void;
};

export default function PhoneInput({
  label,
  dialCode,
  localPhone,
  error,
  onDialCodeChange,
  onLocalPhoneChange,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedCountry = EUROPEAN_COUNTRIES.find(
    (c) => PHONE_DIAL_CODES[c.code] === dialCode,
  );

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-600">{label}</span>
      <div className="flex gap-2" ref={ref}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 items-center gap-1 border border-neutral-300 bg-(--white-white) px-3 text-sm font-bold text-neutral-700 focus:border-(--brand-green-01)"
          >
            <span>{dialCode}</span>
            <ChevronDown size={13} className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <div className="absolute left-0 top-full z-50 mt-1 max-h-52 w-44 overflow-y-auto rounded-[3px] bg-white shadow-xl ring-1 ring-black/10">
              {EUROPEAN_COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => { onDialCodeChange(PHONE_DIAL_CODES[c.code]); setOpen(false); }}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-neutral-100 ${
                    c.code === selectedCountry?.code ? "text-(--brand-green-01)" : "text-neutral-700"
                  }`}
                >
                  <span className="font-bold">{PHONE_DIAL_CODES[c.code]}</span>
                  <span className="text-xs text-neutral-500">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1">
          <input
            type="tel"
            placeholder="12 34 56 78"
            value={localPhone}
            onChange={(e) => onLocalPhoneChange(e.target.value)}
            className={`h-11 w-full border bg-(--white-white) px-3 text-sm font-semibold text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-(--brand-green-01) ${
              error ? "border-red-400" : "border-neutral-300"
            }`}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-red-500">{error}</p>}
    </label>
  );
}
