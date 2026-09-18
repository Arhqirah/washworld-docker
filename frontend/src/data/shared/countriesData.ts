// Europæiske lande med ISO-koder og opkaldskoder.
// Bruges af CountrySelector, PhoneInput, VehicleForm og phoneUtils.

export type Country = { code: string; name: string };

export const EUROPEAN_COUNTRIES: Country[] = [
  { code: "DK", name: "Danmark" },
  { code: "SE", name: "Sverige" },
  { code: "NO", name: "Norge" },
  { code: "FI", name: "Finland" },
  { code: "DE", name: "Tyskland" },
  { code: "NL", name: "Holland" },
  { code: "BE", name: "Belgien" },
  { code: "FR", name: "Frankrig" },
  { code: "ES", name: "Spanien" },
  { code: "PT", name: "Portugal" },
  { code: "IT", name: "Italien" },
  { code: "AT", name: "Østrig" },
  { code: "CH", name: "Schweiz" },
  { code: "PL", name: "Polen" },
  { code: "CZ", name: "Tjekkiet" },
  { code: "SK", name: "Slovakiet" },
  { code: "HU", name: "Ungarn" },
  { code: "RO", name: "Rumænien" },
  { code: "BG", name: "Bulgarien" },
  { code: "HR", name: "Kroatien" },
  { code: "SI", name: "Slovenien" },
  { code: "GR", name: "Grækenland" },
  { code: "IE", name: "Irland" },
  { code: "GB", name: "Storbritannien" },
  { code: "LU", name: "Luxembourg" },
  { code: "EE", name: "Estland" },
  { code: "LV", name: "Letland" },
  { code: "LT", name: "Litauen" },
  { code: "MT", name: "Malta" },
  { code: "CY", name: "Cypern" },
];

export const PHONE_DIAL_CODES: Record<string, string> = {
  DK: "+45", SE: "+46", NO: "+47", FI: "+358", DE: "+49",
  NL: "+31", BE: "+32", FR: "+33", ES: "+34", PT: "+351",
  IT: "+39", AT: "+43", CH: "+41", PL: "+48", CZ: "+420",
  SK: "+421", HU: "+36", RO: "+40", BG: "+359", HR: "+385",
  SI: "+386", GR: "+30", IE: "+353", GB: "+44", LU: "+352",
  EE: "+372", LV: "+371", LT: "+370", MT: "+356", CY: "+357",
};
