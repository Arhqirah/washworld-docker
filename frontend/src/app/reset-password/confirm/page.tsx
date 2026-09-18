// ResetPasswordConfirmPage – siden hvor brugeren indtaster sin nye adgangskode.
// Modtager en reset-nøgle via URL-parameteren "key" som sendes med til API'et.
// Viser fejl hvis nøglen mangler eller er ugyldig, og bekræftelse når adgangskoden er gemt.

"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/buttons";
import { ROUTES } from "@/lib/routes";
import { confirmPasswordReset } from "@/lib/authApi";

const PASSWORD_MIN = 8;

function getInputStyle(value: string) {
  if (value.length === 0) return "border-2 border-transparent";
  if (value.length < PASSWORD_MIN) return "border-2 border-red-400";
  return "border-2 border-green-400";
}

function ResetPasswordConfirmForm() {
  const searchParams = useSearchParams();
  const resetKey = searchParams.get("key") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(
    () => !resetKey ? "Ugyldigt eller manglende link. Anmod om et nyt." : null,
  );

  const passwordsMatch = confirm.length > 0 && password === confirm;
  const canSubmit = password.length >= PASSWORD_MIN && passwordsMatch && !isSubmitting && !!resetKey;

  // Sender den nye adgangskode og reset-nøglen til API'et og viser bekræftelse ved succes.
  async function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await confirmPasswordReset(resetKey, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noget gik galt. Prøv igen.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="absolute inset-0 z-10 h-full w-full overflow-hidden">
      <Image
        src="/background/washworld-background.png"
        alt="Baggrund"
        fill
        sizes="(max-width: 430px) 100vw, 430px"
        priority
      />

      <div className="absolute inset-0 z-20 bg-(--color-overlay-dark-40)" />

      <div className="relative z-20 flex h-full flex-col items-center justify-center gap-4">
        <Image
          src="/logos/washworld-white.png"
          alt="Wash World logo"
          width={234}
          height={102}
          priority
          style={{ width: "auto" }}
          className="mb-10"
        />

        {done ? (
          <div className="flex w-72 flex-col items-center gap-6 text-center">
            <p className="text-lg font-bold text-white">Adgangskode nulstillet!</p>
            <p className="text-sm text-white/80">
              Din adgangskode er opdateret. Du kan nu logge ind med din nye adgangskode.
            </p>
            <Link
              href={ROUTES.login}
              className="btn btn--primary btn--lg w-full text-center"
            >
              Gå til login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-72 flex-col gap-1">
            <p className="mb-3 text-center text-sm font-semibold text-white/80">
              Indtast din nye adgangskode.
            </p>

            <input
              placeholder="Ny adgangskode"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || !resetKey}
              className={`w-full bg-(--color-surface) p-3 outline-none transition-colors ${getInputStyle(password)}`}
            />
            <p className="min-h-4 text-xs text-red-400">
              {password.length > 0 && password.length < PASSWORD_MIN
                ? `Min. ${PASSWORD_MIN} tegn (${password.length}/${PASSWORD_MIN})`
                : ""}
            </p>

            <input
              placeholder="Bekræft adgangskode"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={isSubmitting || !resetKey}
              className={`w-full bg-(--color-surface) p-3 outline-none transition-colors ${
                confirm.length === 0
                  ? "border-2 border-transparent"
                  : passwordsMatch
                    ? "border-2 border-green-400"
                    : "border-2 border-red-400"
              }`}
            />
            <p className="min-h-4 text-xs text-red-400">
              {confirm.length > 0 && !passwordsMatch ? "Adgangskoderne matcher ikke" : ""}
            </p>

            <div className="mb-2 min-h-4">
              {error ? <p className="text-sm text-red-400">{error}</p> : null}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!canSubmit}
              className="w-full"
            >
              {isSubmitting ? "Gemmer…" : "Gem ny adgangskode"}
            </Button>

            <Link
              href={ROUTES.login}
              className="mt-3 text-sm text-white/70 hover:text-white"
            >
              Tilbage til login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense>
      <ResetPasswordConfirmForm />
    </Suspense>
  );
}
