"use client";

// SignUpPage – opretter en ny bruger.
// validate() tjekker alle felter lokalt før API-kaldet sendes.
// Ved succes returnerer API'et et JWT-token og brugerdata, som gemmes i AuthContext,
// og brugeren sendes direkte til /dashboard uden at skulle logge ind separat.

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { AuthButton } from "@/components/buttons";
import { registerUser } from "@/lib/authApi";
import { ROUTES } from "@/lib/routes";

export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.firstName) newErrors.firstName = "Fornavn er påkrævet";
    if (!form.lastName) newErrors.lastName = "Efternavn er påkrævet";
    if (!form.email.includes("@")) newErrors.email = "Ugyldig email";
    if (form.password.length < 8) newErrors.password = "Min. 8 tegn";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Kodeord matcher ikke";
    if (!acceptedTerms) newErrors.terms = "Du skal acceptere vilkårene";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupClick = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerUser({
        user_firstname: form.firstName,
        user_lastname: form.lastName,
        user_email: form.email,
        user_password: form.password,
      });
      setRegistered(true);
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Noget gik galt. Prøv igen." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="absolute inset-0 w-full h-full overflow-hidden z-10">
        <Image
          src="/background/washworld-background.png"
          alt="Baggrund"
          fill
          sizes="(max-width: 430px) 100vw, 430px"
          priority
        />

        <div className="absolute inset-0 bg-(--color-overlay-dark-40) z-20" />
        {registered ? (
          <div className="relative z-20 flex flex-col items-center justify-center h-full gap-4 text-center px-8">
            <Image
              src="/logos/washworld-white.png"
              alt="Wash World logo"
              width={234}
              height={102}
              priority
              style={{ width: "auto" }}
              className="mb-6"
            />
            <h2 className="text-2xl font-bold text-white">Tjek din email</h2>
            <p className="text-white/80 text-sm max-w-xs">
              Vi har sendt en bekræftelsesmail. Klik på linket i mailen for at aktivere din konto.
            </p>
            <Link
              href={ROUTES.login}
              className="mt-4 text-sm font-semibold text-(--color-secondary) hover:underline"
            >
              Gå til login
            </Link>
          </div>
        ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); void handleSignupClick(); }}
          noValidate
          className="relative z-20 flex flex-col items-center justify-center h-full gap-4"
        >
          <h2 className="-mt-4 text-white text-3xl font-bold">Velkommen til</h2>

          <Image
            src="/logos/washworld-white.png"
            alt="Wash World logo"
            width={234}
            height={102}
            priority
            style={{ width: "auto" }}
            className="mb-18"
          />

          <input
            name="firstName"
            placeholder="Fornavn"
            value={form.firstName}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.firstName ?? ""}
          </p>

          <input
            name="lastName"
            placeholder="Efternavn"
            value={form.lastName}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.lastName ?? ""}
          </p>

          <input
            name="email"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-72 p-3 bg-(--color-surface)"
          />
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.email ?? ""}
          </p>

          <div className="relative w-72">
            <input
              name="password"
              placeholder="Kodeord"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 pr-11 bg-(--color-surface)"
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
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.password ?? ""}
          </p>

          <div className="relative w-72">
            <input
              name="confirmPassword"
              placeholder="Gentag kodeord"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 pr-11 bg-(--color-surface)"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={showConfirmPassword ? "Skjul kodeord" : "Vis kodeord"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.confirmPassword ?? ""}
          </p>

          <label className="mx-auto mt-2.5 flex w-full max-w-72 items-center justify-center gap-2 text-[0.95rem] font-semibold text-(--white-white)">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="h-4 w-4 accent-(--brand-green-01)"
            />
            <span>
              Jeg accepterer{" "}
              <Link
                href={ROUTES.terms}
                className="text-(--color-secondary) font-semibold hover:underline"
              >
                Brugervilkår
              </Link>
            </span>
          </label>
          <p className="min-h-4 text-red-400 text-xs -mt-3">
            {errors.terms ?? ""}
          </p>

          <p className="min-h-4 text-red-400 text-sm">
            {errors.general ?? ""}
          </p>

          <AuthButton
            mode="signup"
            secondaryHref={ROUTES.login}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </form>
        )}
      </div>
    </>
  );
}
