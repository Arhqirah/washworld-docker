// ResetPasswordPage – siden hvor brugeren anmoder om nulstilling af kodeord.
// Brugeren indtaster sin email og API'et sender et nulstillingslink.
// Efter afsendelse vises en bekræftelsesbesked uanset om emailen eksisterer (af sikkerhedshensyn).

"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { Button } from "@/components/buttons";
import { ROUTES } from "@/lib/routes";
import { requestPasswordReset } from "@/lib/authApi";

const MIN_EMAIL_LENGTH = 5;

function getInputStyle(value: string) {
  if (value.length === 0) return "border-2 border-transparent";
  if (value.length < MIN_EMAIL_LENGTH) return "border-2 border-red-400";
  return "border-2 border-green-400";
}

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.length >= MIN_EMAIL_LENGTH && !isSubmitting;

  async function handleSubmit(event?: FormEvent) {
    event?.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsSubmitting(true);

    try {
      await requestPasswordReset(email);
      setSubmitted(true);
    } catch {
      setError("Noget gik galt. Prøv igen.");
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

        {submitted ? (
          <div className="flex w-72 flex-col items-center gap-6 text-center">
            <p className="text-lg font-bold text-white">Email sendt!</p>
            <p className="text-sm text-white/80">
              Hvis der findes en konto med denne email, modtager du snart et link til at nulstille dit kodeord.
            </p>
            <Link
              href={ROUTES.login}
              className="btn btn--primary btn--lg w-full text-center"
            >
              Tilbage til login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-72 flex-col gap-1"
          >
            <p className="mb-3 text-center text-sm font-semibold text-white/80">
              Indtast din email, så sender vi dig et link til at nulstille dit kodeord.
            </p>

            <input
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              className={`w-full bg-(--color-surface) p-3 outline-none transition-colors ${getInputStyle(email)}`}
            />
            <p className="min-h-4 text-xs text-red-400">
              {email.length > 0 && email.length < MIN_EMAIL_LENGTH
                ? `Min. ${MIN_EMAIL_LENGTH} tegn (${email.length}/${MIN_EMAIL_LENGTH})`
                : ""}
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
              {isSubmitting ? "Sender…" : "Nulstil adgangskode"}
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
