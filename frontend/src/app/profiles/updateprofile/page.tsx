"use client";

// UpdateProfilePage – redigér navn, email, telefonnummer og kodeord.
// Al formular-logik ligger i useUpdateProfile; komponenter i src/components/.

import { Check, KeyRound, UserRound } from "lucide-react";
import Link from "next/link";

import PageInfo from "@/components/shared/PageInfo";
import InputField from "@/components/profile/InputField";
import PhoneInput from "@/components/profile/PhoneInput";
import SectionTitle from "@/components/profile/SectionTitle";
import { Button } from "@/components/buttons";
import { profileUpdatePageContent } from "@/data/profile/profileData";
import { useUpdateProfile } from "@/hooks";
import { ROUTES } from "@/lib/routes";

export default function UpdateProfilePage() {
  const {
    user,
    displayFullName,
    formState,
    phoneError,
    error,
    isSaving,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleInputChange,
    handleSave,
    handleDeleteAccount,
  } = useUpdateProfile();

  return (
    <div className="min-h-full">
      <PageInfo
        text={profileUpdatePageContent.pageInfoTitle}
        userName={displayFullName}
      />

      <section className="space-y-4 px-4 pb-6 pt-3">
        <article className="rounded-[3px] bg-(--white-white) shadow-2xl p-5">
          <SectionTitle
            icon={<UserRound className="h-4 w-4" strokeWidth={2.4} />}
            title={profileUpdatePageContent.profileSectionTitle}
          />

          <div className="mt-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                <UserRound className="h-9 w-9" strokeWidth={2.2} />
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold text-neutral-500">
                  {profileUpdatePageContent.memberSinceLabel}
                </p>
                <p className="text-sm font-bold text-neutral-700">
                  {user?.user_created_at
                    ? new Date(user.user_created_at).toLocaleDateString("da-DK", { month: "long", year: "numeric" })
                    : "—"}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  label={profileUpdatePageContent.fields.firstName.label}
                  placeholder={profileUpdatePageContent.fields.firstName.placeholder}
                  value={formState.firstName}
                  onChange={(value) => handleInputChange("firstName", value)}
                />
                <InputField
                  label={profileUpdatePageContent.fields.lastName.label}
                  placeholder={profileUpdatePageContent.fields.lastName.placeholder}
                  value={formState.lastName}
                  onChange={(value) => handleInputChange("lastName", value)}
                />
              </div>
              <InputField
                label={profileUpdatePageContent.fields.email.label}
                type="email"
                placeholder={profileUpdatePageContent.fields.email.placeholder}
                value={formState.email}
                onChange={(value) => handleInputChange("email", value)}
              />
              <PhoneInput
                label={profileUpdatePageContent.fields.phoneNumber.label}
                dialCode={formState.dialCode}
                localPhone={formState.localPhone}
                error={phoneError}
                onDialCodeChange={(code) => handleInputChange("dialCode", code)}
                onLocalPhoneChange={(val) => handleInputChange("localPhone", val)}
              />
            </div>
          </div>
        </article>

        <article className="rounded-[3px] bg-(--white-white) shadow-2xl p-5">
          <SectionTitle
            icon={<KeyRound className="h-4 w-4" strokeWidth={2.4} />}
            title={profileUpdatePageContent.passwordSectionTitle}
          />
          <p className="mt-3 text-sm text-neutral-500">
            Vi sender et link til din email, som du kan bruge til at vælge en ny adgangskode.
          </p>
          <p className="mt-2 text-sm text-neutral-500">
            <Link
              href={ROUTES.resetPassword}
              className="font-semibold text-(--color-secondary) hover:underline"
            >
              Nulstil din adgangskode her
            </Link>
          </p>
        </article>

        <div className="space-y-3">
          {error && (
            <p className="text-center text-sm font-semibold text-red-500">{error}</p>
          )}
          <Button
            variant="primary"
            size="lg"
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex w-full items-center justify-center gap-2 font-semibold disabled:opacity-60"
          >
            <Check className="h-4.5 w-4.5" strokeWidth={2.5} />
            {isSaving ? "Gemmer..." : profileUpdatePageContent.buttons.save}
          </Button>

          {!showDeleteConfirm ? (
            <Button
              variant="danger"
              size="lg"
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 font-semibold disabled:opacity-60"
            >
              Slet konto
            </Button>
          ) : (
            <div className="rounded-[3px] border border-red-200 bg-red-50 p-4 space-y-3">
              <p className="text-sm font-semibold text-red-700 text-center">
                Er du sikker? Denne handling kan ikke fortrydes.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="flex-1 font-semibold disabled:opacity-60"
                >
                  Annuller
                </Button>
                <Button
                  variant="danger"
                  size="md"
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 font-semibold disabled:opacity-60"
                >
                  {isDeleting ? "Sletter..." : "Ja, slet konto"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
