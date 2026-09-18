// Generisk enkeltlinje-inputfelt med label og stylet til projektets designsystem.

type InputFieldProps = {
  label: string;
  type?: "text" | "email" | "tel";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export default function InputField({ label, type = "text", placeholder, value, onChange }: InputFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-neutral-600">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full border border-neutral-300 bg-(--white-white) px-3 text-sm font-semibold text-neutral-700 outline-none placeholder:text-neutral-400 focus:border-(--brand-green-01)"
      />
    </label>
  );
}
