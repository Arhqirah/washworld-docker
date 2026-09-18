// PlanFeature – viser én feature/fordel på et abonnements- eller enkeltvaskeplankortet.
// Bruges af subscriptions/page.tsx og singlewash/page.tsx i feature-grid'et på plankortet.
//
// level 0 → grå minus (funktionen er ikke inkluderet i dette plan)
// level 1 → grønt enkelt hak (funktionen er inkluderet)
// level 2 → grønt dobbelt hak (funktionen er inkluderet med ekstra fordel, fx Premium+)

export function PlanFeature({ text, level = 0 }: { text: string; level: number }) {
  const isIncluded = level > 0;
  const isDouble = level === 2;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`relative flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-bold text-white ${
          isIncluded ? "bg-(--brand-green-01)" : "bg-(--color-grey-02)"
        }`}
      >
        {isIncluded ? (
          <>
            <span className={isDouble ? "absolute -left-0.5" : ""}>✓</span>
            {isDouble && <span className="absolute left-1.25">✓</span>}
          </>
        ) : (
          "−"
        )}
      </span>
      <span>{text}</span>
    </div>
  );
}
