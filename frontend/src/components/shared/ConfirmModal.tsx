// ConfirmModal – generisk bekræftelsesdialog der vises oven på siden som et overlay.
// Bruges på:
//   - profiles/page.tsx → "Er du sikker på at du vil opsige abonnementet?"
//   - details/page.tsx  → "Abonnement dækker ikke her – vil du starte en enkelt vask?"
//
// Props:
//   title           → overskrift i dialogen
//   message         → brødtekst (kan være JSX med fx fed tekst)
//   confirmLabel    → tekst på bekræft-knappen (fx "Opsig" eller "Start enkelt vask")
//   cancelLabel     → tekst på annuller-knappen (standard: "Annuller")
//   confirmClassName → Tailwind-klasser til bekræft-knappen (kan overskrives for grøn vs. rød)
//   onConfirm       → kaldes når brugeren trykker bekræft
//   onCancel        → kaldes når brugeren trykker annuller eller på baggrunden

interface ConfirmModalProps {
  title: string;
  message: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  confirmClassName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel,
  cancelLabel = "Annuller",
  confirmClassName = "flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      <div className="w-full max-w-sm rounded-[3px] bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-neutral-800">{title}</h2>
        <p className="mt-2 text-sm font-semibold text-neutral-600">{message}</p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-sm font-bold text-neutral-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmClassName}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
