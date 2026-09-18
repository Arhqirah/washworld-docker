// Sektion-overskrift med rundt ikon til venstre og overskrift-tekst.
// Bruges på profil-relaterede sider til at adskille formularafsnit visuelt.

import { type ReactNode } from "react";

export default function SectionTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-(--brand-green-01)">
        {icon}
      </span>
      <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
    </div>
  );
}
