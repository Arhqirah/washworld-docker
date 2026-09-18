// AuthButton – den dobbelte knap-komponent på login- og signup-siderne.
// Venstre knap er submit (Log ind/Opret), højre knap er et link til den anden side (Ny bruger/Login).

import Link from "next/link";

interface AuthButtonProps {
  mode: "login" | "signup";
  secondaryHref: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function AuthButton({
  mode,
  secondaryHref,
  disabled,
  isLoading,
}: AuthButtonProps) {
  const isPrimaryLogin = mode === "login";

  return (
    <div className="flex w-full max-w-60.5">
      <button
        type="submit"
        disabled={disabled}
        className="relative z-10 h-12.5 flex-[1.02] overflow-hidden bg-transparent disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 bg-(--brand-green-01) [clip-path:polygon(0_0,100%_0,76%_100%,0_100%)]" aria-hidden="true" />
        <span className="relative flex h-full items-center justify-center text-xl font-bold tracking-tight text-white">
          {isPrimaryLogin
            ? isLoading ? "Logger ind..." : "Log ind"
            : isLoading ? "Opretter..." : "Opret"}
        </span>
      </button>

      <Link
        href={secondaryHref}
        className="-ml-[29px] relative flex h-12.5 flex-1 overflow-hidden bg-transparent"
      >
        <span className="absolute inset-0 bg-(--color-grey-01) [clip-path:polygon(24%_0,100%_0,100%_100%,0_100%)]" aria-hidden="true" />
        <span className="relative flex h-full w-full items-center justify-center px-3 whitespace-nowrap text-[0.97rem] font-medium tracking-tight text-white">
          {isPrimaryLogin ? "Ny bruger" : "Login"}
        </span>
      </Link>
    </div>
  );
}
