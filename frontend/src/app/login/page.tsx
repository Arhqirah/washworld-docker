"use client";

// LoginPage – appens indgangsside.
// Brugeren indtaster email og kodeord. Ved succes gemmes token + brugerdata
// i AuthContext (og localStorage), og brugeren sendes til /dashboard.
// Fejlbeskeder kommer direkte fra API-svaret og vises under formularen.

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { type FormEvent, useState } from "react";
import { AuthButton } from "@/components/buttons";
import { useAuth } from "@/hooks";
import { loginUser } from "@/lib/authApi";
import { ROUTES } from "@/lib/routes";

const MIN_EMAIL_LENGTH = 5;
const MIN_PASSWORD_LENGTH = 8;

// Returnerer en Tailwind border-klasse baseret på feltets nuværende længde.
// Ingen farve mens feltet er tomt, rød hvis for kort, grøn når det ser ud til at være gyldigt.
function getInputStyle(value: string, minLength: number) {
  if (value.length === 0) return "border-2 border-transparent";
  if (value.length < minLength) return "border-2 border-red-400";
  return "border-2 border-green-400";
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login-knappen er deaktiveret mens AuthContext stadig tjekker et gemt token (authLoading),
  // eller mens et login-kald allerede er i gang (isSubmitting).
  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const { token, user } = await loginUser(
        email.trim().toLowerCase(),
        password,
      );
      login(token, user);
      router.push(ROUTES.dashboard);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ugyldigt brugernavn eller kodeord",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 z-10 h-full w-full overflow-hidden">
        <Image
          src="/background/washworld-background.png"
          alt="Baggrund"
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          priority
        />

        <div className="pointer-events-none absolute inset-0 z-20 bg-(--color-overlay-dark-40)" />
        <form
          onSubmit={handleSubmit}
          className="relative z-20 flex h-full flex-col items-center justify-center gap-4"
        >
          <h2 className="-mt-4 text-3xl font-bold text-white">Velkommen til</h2>

          <Image
            src="/logos/washworld-white.png"
            alt="Wash World logo"
            width={234}
            height={102}
            priority
            style={{ width: "auto" }}
            className="mb-18"
          />

          <div className="flex w-72 flex-col gap-1">
            <input
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-(--color-surface) p-3 outline-none transition-colors ${getInputStyle(email, MIN_EMAIL_LENGTH)}`}
            />
            <p className="min-h-4 text-xs text-red-400">
              {email.length > 0 && email.length < MIN_EMAIL_LENGTH
                ? `Min. ${MIN_EMAIL_LENGTH} tegn (${email.length}/${MIN_EMAIL_LENGTH})`
                : ""}
            </p>
          </div>

          <div className="flex w-72 flex-col gap-1">
            <div className="relative">
              <input
                placeholder="Kodeord"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className={`w-full bg-(--color-surface) p-3 pr-11 outline-none transition-colors ${getInputStyle(password, MIN_PASSWORD_LENGTH)}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Skjul kodeord" : "Vis kodeord"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="min-h-4 text-xs text-red-400">
              {password.length > 0 && password.length < MIN_PASSWORD_LENGTH
                ? `Min. ${MIN_PASSWORD_LENGTH} tegn (${password.length}/${MIN_PASSWORD_LENGTH})`
                : ""}
            </p>
          </div>

          <div className="mb-7 min-h-4">
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
          </div>

          <AuthButton
            mode="login"
            secondaryHref={ROUTES.signup}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          />

          <p className="mt-2 text-sm text-white/70">
            Glemt kodeord?{" "}
            <Link
              href={ROUTES.resetPassword}
              className="font-semibold text-(--color-secondary) hover:underline"
            >
              Nulstil det her
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
