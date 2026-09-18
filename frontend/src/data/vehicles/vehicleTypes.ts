// Køretøjstyper med labels og ikoner — bruges af bil-tilføj og bil-rediger siderne.

import { type ElementType } from "react";
import { Car, Motorbike, Truck, Bus } from "lucide-react";
import type { VehicleType } from "@/types/api";

export const VEHICLE_TYPES: { type: VehicleType; label: string; icon: ElementType }[] = [
  { type: "car",        label: "Personbil",  icon: Car },
  { type: "motorcycle", label: "Motorcykel", icon: Motorbike },
  { type: "truck",      label: "Lastbil",    icon: Truck },
  { type: "bus",        label: "Bus",        icon: Bus },
];
