// PageInfo – grønt skråbanner øverst på sider.
// Viser enten en fast tekst (text-prop) eller "Hej [navn]" hvis userName er givet.
// formattedUserName: formaterer brugernavnet til visning, fx "Simon M." → "Simon".
// content: teksten der vises i banneret — fortrækker text-prop frem for hilsen.
// Returnerer et grønt banner med skrå højrekant og hvid tekst.

import { formatDisplayName } from "@/lib/formatName";

interface PageInfoProps {
  text?: string;
  userName?: string;
  className?: string;
}

export default function PageInfo({ text = "", userName, className = "" }: PageInfoProps) {
  const formattedUserName = userName ? formatDisplayName(userName) : "";
  const content = text || (formattedUserName ? `Hej ${formattedUserName}` : "");

  return (
    <section className={`relative h-12 ${className}`}>
      <div className="relative inline-flex h-full min-w-45 items-center bg-(--brand-green-01) pl-6 pr-10 [clip-path:polygon(0_0,100%_0,88%_100%,0_100%)]">
        <p className="whitespace-nowrap text-2xl font-bold text-white">
          {content}
        </p>
      </div>
    </section>
  );
}
