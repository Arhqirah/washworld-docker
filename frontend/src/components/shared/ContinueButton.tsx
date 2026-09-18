// ContinueButton – en stor grøn knap der bruges til at gå videre til næste trin i en vask-flow.
// Vises grå og kan ikke klikkes (disabled) hvis betingelserne for at fortsætte ikke er opfyldt.

import React from "react";

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export default function ContinueButton({
  onClick,
  disabled = false,
  children,
}: ContinueButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-[3px] bg-(--brand-green-01) px-4 py-1 font-bold text-2xl text-white transition disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}
