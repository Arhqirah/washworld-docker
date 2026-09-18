// StartWashButton – start-vask-knappen med diagonal farveovergradient.
// STATUS_CONFIG: definerer label, gradientfarve og hint-tekst for hver maskinstatus
//   (Ledig = grøn, Optaget = gul, Ud af drift = rød).
// DEFAULT_CONFIG: fallback der bruges hvis status er null eller ukendt — viser "Start vask".
// config: slår maskinens aktuelle status op i STATUS_CONFIG og returnerer den rigtige konfiguration.
// Returnerer knappen (deaktiveret hvis maskinen er optaget/ud af drift) og en valgfri hint-tekst.

type MachineStatus = "Ledig" | "Optaget" | "Ud af drift";

interface StatusConfig {
  disabled: boolean;
  label: string;
  gradient: string;
  textColor: string;
  hint: string | null;
}

const STATUS_CONFIG: Record<MachineStatus, StatusConfig> = {
  Ledig: {
    disabled: false,
    label: "Start vask",
    gradient: "bg-[linear-gradient(60deg,var(--brand-green-02)_0%,var(--brand-green-02)_52%,var(--color-grey-01)_52%,var(--color-grey-01)_100%)]",
    textColor: "text-(--color-grey-03)",
    hint: null,
  },
  Optaget: {
    disabled: true,
    label: "Optaget",
    gradient: "bg-[linear-gradient(60deg,#f59e0b_0%,#f59e0b_52%,#d1d5db_52%,#d1d5db_100%)]",
    textColor: "text-white",
    hint: null,
  },
  "Ud af drift": {
    disabled: true,
    label: "Ud af drift",
    gradient: "bg-[linear-gradient(60deg,#ef4444_0%,#ef4444_52%,#d1d5db_52%,#d1d5db_100%)]",
    textColor: "text-white",
    hint: null,
  },
};

const DEFAULT_CONFIG = STATUS_CONFIG.Ledig;

interface StartWashButtonProps {
  onClick?: () => void;
  status?: MachineStatus | string | null;
  noSelection?: boolean;
}

const NO_SELECTION_CONFIG: StatusConfig = {
  disabled: true,
  label: "Start vask",
  gradient: DEFAULT_CONFIG.gradient,
  textColor: DEFAULT_CONFIG.textColor,
  hint: null,
};

export default function StartWashButton({ onClick, status, noSelection }: StartWashButtonProps) {
  const config = noSelection
    ? NO_SELECTION_CONFIG
    : (status && status in STATUS_CONFIG)
      ? STATUS_CONFIG[status as MachineStatus]
      : DEFAULT_CONFIG;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-102.5 gap-2">
      <button
        type="button"
        onClick={config.disabled ? undefined : onClick}
        disabled={config.disabled}
        className="relative rounded-[3px] flex h-16 w-full max-w-80 items-center justify-center overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.35)] disabled:opacity-80 disabled:cursor-not-allowed"
      >
        <div className={`absolute inset-0 ${config.gradient}`} />
        <span className={`relative z-10 text-[1.35rem] font-bold tracking-tight ${config.textColor}`}>
          {config.label}
        </span>
      </button>
      {config.hint && (
        <p className="text-xs text-neutral-500">{config.hint}</p>
      )}
    </div>
  );
}
