// EmailVerifiedPage – siden brugeren lander på efter at have klikket bekræftelseslinket i sin velkomstemail.
// Viser forskellige beskeder baseret på URL-parameteren "status": success, already-verified, expired, invalid eller deleted.

"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const verificationResults = {
  success: {
    title: "Email Bekræftet",
    message:
      "Din email er blevet bekræftet. Du kan nu logge ind på din konto.",
    buttonText: "Gå til login",
  },
  "already-verified": {
    title: "Email Allerede Bekræftet",
    message:
      "Denne email er allerede blevet bekræftet. Du kan logge ind på din konto.",
    buttonText: "Gå til login",
  },
  expired: {
    title: "Linket Er Udløbet",
    message:
      "Dit bekræftelseslink er udløbet. Opret en ny konto eller få tilsendt et nyt bekræftelseslink.",
    buttonText: "Tilbage til login",
  },
  invalid: {
    title: "Ugyldigt Link",
    message: "Bekræftelseslinket er ugyldigt eller findes ikke.",
    buttonText: "Tilbage til login",
  },
  deleted: {
    title: "Konto Ikke Tilgængelig",
    message: "Denne konto er slettet og kan ikke bekræftes.",
    buttonText: "Tilbage til login",
  },
} as const;

type VerificationStatus = keyof typeof verificationResults;

function EmailVerifiedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "success";

  const result =
    status in verificationResults
      ? verificationResults[status as VerificationStatus]
      : verificationResults.invalid;

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-7 pb-10 pt-6 text-center">
      <article className="mx-auto w-[82%] rounded-[3px] bg-(--white-white) px-5 py-7 shadow-lg">
        <h1 className="text-[1.7rem] font-bold leading-tight text-black">
          {result.title}
        </h1>

        <p className="mx-auto mt-5 max-w-67.5 text-[0.9rem] font-bold leading-tight text-neutral-600">
          {result.message}
        </p>

        <Link
          href="/login"
          className="mx-auto mt-7 flex h-10.5 w-[85%] items-center justify-center bg-(--brand-green-01) text-[0.95rem] font-bold text-white transition hover:bg-(--brand-green-02)"
        >
          {result.buttonText}
        </Link>
      </article>
    </section>
  );
}

export default function EmailVerifiedPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Suspense>
        <EmailVerifiedContent />
      </Suspense>
    </div>
  );
}
