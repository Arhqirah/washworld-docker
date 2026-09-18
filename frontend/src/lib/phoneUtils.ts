// Hjælpefunktioner til parsing og validering af telefonnumre med landekode.
// Bruges af PhoneInput-komponenten og useUpdateProfile-hooken.

import { PHONE_DIAL_CODES } from "@/data/shared/countriesData";

// Forventede længder (antal cifre) for lokale numre per landekode.
// Lande med ét gyldigt antal angives som [n, n], ellers [min, max].
export const PHONE_LENGTH_BY_DIAL_CODE: Record<string, [number, number]> = {
  "+45": [8, 8],   // Danmark
  "+46": [7, 10],  // Sverige
  "+47": [8, 8],   // Norge
  "+358": [5, 12], // Finland
  "+354": [7, 7],  // Island
  "+44": [7, 10],  // UK
  "+49": [3, 12],  // Tyskland
  "+33": [9, 9],   // Frankrig
  "+34": [9, 9],   // Spanien
  "+39": [6, 11],  // Italien
  "+31": [9, 9],   // Holland
  "+32": [8, 9],   // Belgien
  "+41": [9, 9],   // Schweiz
  "+43": [4, 13],  // Østrig
  "+48": [9, 9],   // Polen
};

// Splitter et gemt telefonnummer som "+45 12345678" i landekode og lokalnummer.
// Sorterer koderne længst-først så "+358" matches før "+35" ved overlap.
// Falder tilbage til +45/dansk nummer hvis ingen kode genkendes.
export function parsePhone(stored: string): { dialCode: string; localPhone: string } {
  const sorted = Object.values(PHONE_DIAL_CODES).sort((a, b) => b.length - a.length);
  for (const code of sorted) {
    if (stored.startsWith(code)) {
      return { dialCode: code, localPhone: stored.slice(code.length).trim() };
    }
  }
  return { dialCode: "+45", localPhone: stored.replace(/^\+\d+\s*/, "") };
}

// Validerer selve nummeret uden landekode ud fra dialCode.
// Brugeren kan frit taste "12 34 56 78" eller "12-34-56-78" — mellemrum og
// bindestreger strippes inden tjekket.
export function validateLocalPhone(local: string, dialCode: string): string | null {
  const digits = local.replace(/[\s\-]/g, "");
  if (!digits) return "Telefonnummer er påkrævet";
  if (!/^\d+$/.test(digits)) return "Kun cifre, mellemrum og bindestreger er tilladt";
  const [min, max] = PHONE_LENGTH_BY_DIAL_CODE[dialCode] ?? [6, 12];
  if (digits.length < min || digits.length > max) {
    return min === max
      ? `${dialCode}-numre skal være præcis ${min} cifre (du har ${digits.length})`
      : `${dialCode}-numre skal være ${min}–${max} cifre (du har ${digits.length})`;
  }
  return null;
}
