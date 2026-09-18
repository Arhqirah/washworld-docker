// Stamp – ét klippekorts-stempel, fyldt (grønt) eller tomt (grå stiplet).

export default function Stamp({ filled = false, children }: { filled?: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-lg text-white font-bold ${
        filled
          ? "border-emerald-400 bg-emerald-500 text-white"
          : "border-neutral-500 bg-neutral-400 text-neutral-700 border-dashed"
      }`}
    >
      {children}
    </div>
  );
}
