// LicensePlate – viser en nummerplade i EU-stil med blå landekode-stribe til venstre.
// Bruges på:
//   - cars/page.tsx (VehicleCard) → viser countryCode, fx "DK"
//   - receipts/page.tsx (WashCard og SubscriptionCard) → kun pladen uden landekode-tekst
//
// countryCode er valgfri – udelades den vises en tom blå stribe (som på en rigtig EU-plade).

export function LicensePlate({
  plate,
  countryCode,
}: {
  plate: string;
  countryCode?: string;
}) {
  return (
    <div className="flex h-10 overflow-hidden border-2 border-neutral-800 bg-white">
      <span className="flex w-7 shrink-0 items-center justify-center bg-[#327fc2] text-[10px] font-bold text-white">
        {countryCode ?? ""}
      </span>
      <span className="flex items-center px-3 text-[15px] font-bold tracking-[0.08em] text-neutral-950">
        {plate}
      </span>
    </div>
  );
}
