// ReceiptActionList – handlingsknapper til kvitteringsdetaljesider (download, email, support).

import {
  ArrowDownTrayIcon,
  EnvelopeIcon,
  LifebuoyIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { receiptActionNames } from "@/data/receipts/receiptHistory";

const receiptActionIcons: Record<string, React.ReactNode> = {
  "Download Kvittering": <ArrowDownTrayIcon className="h-5 w-5" />,
  "Send til email": <EnvelopeIcon className="h-5 w-5" />,
  "Kontakt support": <LifebuoyIcon className="h-5 w-5" />,
};

export default function ReceiptActionList() {
  return (
    <article className="rounded-[3px] bg-white px-4 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.08)]">
      {receiptActionNames.map((action, index) => (
        <button
          key={action}
          type="button"
          className={`flex w-full items-center gap-3 py-3 text-left text-[13px] font-bold text-neutral-950 ${
            index < receiptActionNames.length - 1 ? "border-b border-neutral-100" : ""
          }`}
        >
          <span className="text-(--brand-green-01)">{receiptActionIcons[action]}</span>
          <span>{action}</span>
          <span className="ml-auto text-(--brand-green-01)">
            <ChevronRightIcon className="h-5 w-5" />
          </span>
        </button>
      ))}
    </article>
  );
}
