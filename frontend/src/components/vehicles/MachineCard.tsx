// MachineCard – enkelt maskine-kort med billede, titel og status-badge.
// Kan markeres som valgt (grøn ring) eller tonet ned (faded) når en anden er valgt.

import Image from "next/image";
import AngleButton from "@/components/buttons/AngleButton";

const statusClass: Record<string, string> = {
  Ledig: "bg-(--brand-green-01)",
  Optaget: "bg-amber-500",
  "Ud af drift": "bg-red-500",
};

const selectedRingClass: Record<string, string> = {
  Ledig: "ring-(--brand-green-01)",
  Optaget: "ring-amber-500",
  "Ud af drift": "ring-red-500",
};

export interface MachineCardProps {
  id: string;
  image: string;
  title: string;
  status: string;
  selected: boolean;
  faded: boolean;
  onSelect: (id: string | null) => void;
}

export default function MachineCard({ id, image, title, status, selected, faded, onSelect }: MachineCardProps) {
  return (
    <button
      onClick={() => onSelect(selected ? null : id)}
      className={`flex h-20 min-w-50 shrink-0 items-end overflow-hidden rounded-[3px] bg-white font-bold shadow-md ring-inset transition-all ${selected ? `ring-4 ${selectedRingClass[status] ?? "ring-(--brand-green-01)"}` : ""} ${faded ? "opacity-40" : ""}`}
    >
      <div className="flex flex-1 self-center flex-row items-center justify-start gap-2 p-1">
        <Image src={image} alt={title} width={67} height={67} className="h-14 w-14 object-contain" />
        <span className="text-sm font-bold text-neutral-800">{title}</span>
      </div>
      <AngleButton text={status} size="lg" className={statusClass[status] ?? "bg-neutral-400"} />
    </button>
  );
}
