// AngleButton – en skrå dekorationsknap med grøn WashWorld-stil (polygon-clip-path).
// Bruges som et visuelt badge/label, fx til at markere et valgt abonnement eller en handling.

interface AngleButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AngleButton({ text, className = "bg-(--brand-green-01)", size = "sm" }: AngleButtonProps) {
  const sizeClasses =
    size === "lg"
      ? "h-10 pl-10 pr-4 text-sm"
      : size === "md"
        ? "h-8 pl-8 pr-3 text-sm"
        : "h-6 pl-6 pr-2 text-xs";

  return (
    <div className="-right-px -bottom-px">
      <span className={`flex items-center justify-end rounded-none border-0 leading-none font-bold text-white [clip-path:polygon(24%_0,101%_0,101%_101%,0_101%)] ${sizeClasses} ${className}`}>
        {text}
      </span>
    </div>
  );
}
