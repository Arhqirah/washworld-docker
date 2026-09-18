// ProfilePage (profiles/page.tsx) – brugerens profilside.
// Viser brugerkort, abonnementsliste, betalingskort, klippekort og badges.
//
// ?updated=1 i URL'en sættes af updateprofile/page.tsx efter en vellykket profilopdatering.
// Toasten vises og URL'en renses bagefter så beskeden ikke dukker op igen ved genindlæsning.
// Betalingskort gemmes i localStorage under nøglen SAVED_PAYMENT_CARD_STORAGE_KEY (profileData.ts).

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Ticket, Star, CreditCard } from "lucide-react";

import PageInfo from "@/components/shared/PageInfo";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
import SubscriptionRow from "@/components/profile/SubscriptionRow";
import Stamp from "@/components/profile/Stamp";
import {
  profileBadges,
  profilePageNames,
  profileStamps,
  SAVED_PAYMENT_CARD_STORAGE_KEY,
} from "@/data/profile/profileData";
import { useAuth, useSubscriptions, useAnimatedToast } from "@/hooks";
import { deleteSubscription } from "@/lib/subscriptionsApi";
import type { Subscription } from "@/types/api";
import { ROUTES } from "@/lib/routes";

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("da-DK", { month: "long", year: "numeric" });
}

export default function ProfilePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, displayFullName } = useAuth();
  const { subscriptions, removeSubscription } = useSubscriptions(user?.user_id);

  const [showBadges, setShowBadges] = useState(false);
  const [activeBadgeId, setActiveBadgeId] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Subscription | null>(null);
  const [savedCardNumber, setSavedCardNumber] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
      if (!raw) return null;
      return (JSON.parse(raw) as { cardNumber: string }).cardNumber ?? null;
    } catch {
      return null;
    }
  });

  const updatedParam = searchParams.get("updated");
  const updatedMessage =
    updatedParam === "preferences"
      ? profilePageNames.preferencesUpdatedMessage
      : profilePageNames.updatedMessage;

  const { show: showToast, phase: toastPhase, trigger: triggerToast } = useAnimatedToast(1860, 2350);

  useEffect(() => {
    if (updatedParam !== "1" && updatedParam !== "preferences") return;
    triggerToast();
    const id = window.setTimeout(() => router.replace(ROUTES.profile), 2350);
    return () => window.clearTimeout(id);
  }, [updatedParam, router, triggerToast]);

  const badges = profileBadges;
  const activeBadge = badges.find((b) => b.id === activeBadgeId) ?? null;

  async function handleCancelSubscription() {
    if (!cancelTarget) return;
    await deleteSubscription(cancelTarget.subscription_id).catch(() => {});
    removeSubscription(cancelTarget.subscription_id);
    setCancelTarget(null);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <main className="relative flex flex-1 flex-col overflow-y-auto pb-4 scrollbar-hide">
        {showToast && (
          <div
            className={`profile-update-toast pointer-events-none absolute right-4 top-4 z-20 max-w-52 rounded-xl bg-white/96 px-4 py-2 text-right text-[0.82rem] font-bold text-(--brand-green-01) shadow-[0_12px_24px_rgba(0,0,0,0.16)] ${toastPhase === "enter" ? "profile-update-toast-enter" : ""} ${toastPhase === "exit" ? "profile-update-toast-exit" : ""}`}
          >
            {updatedMessage}
          </div>
        )}

        <PageInfo text={profilePageNames.title} userName={displayFullName} />

        <section className="space-y-4 p-4 pt-4">

          {/* Brugerkort */}
          <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="flex items-start gap-3 px-4 py-3">
              <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-(--brand-green-01) text-3xl text-white">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor" aria-hidden="true">
                  <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2c-4.42 0-8 2.01-8 4.5V21h16v-2.5c0-2.49-3.58-4.5-8-4.5Z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-2xl font-bold text-natural-800">
                  {user ? displayFullName : "—"}
                </h2>
                <p className="mt-0.5 text-sm font-semibold text-neutral-600">{user?.user_email ?? "—"}</p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-600">{user?.user_phone || "—"}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-neutral-200">
              <p className="flex px-4 py-3 text-xs font-semibold items-center text-neutral-600">
                {profilePageNames.memberSinceLabel}{" "}
                {user?.user_created_at ? formatMemberSince(user.user_created_at) : "—"}
              </p>
              <Link
                href={ROUTES.updateProfile}
                className="flex h-11 min-w-45 items-center justify-center bg-(--brand-green-01) px-5 text-xl font-bold text-white [clip-path:polygon(12%_0,100%_0,100%_100%,0_100%)]"
              >
                {profilePageNames.editProfile}
              </Link>
            </div>
          </article>

          {/* Abonnementer */}
          <article className="relative rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <p className="text-sm font-semibold text-neutral-600">Abonnementer</p>
              <Link
                href={ROUTES.subscription}
                className="flex h-8 min-w-24 items-center justify-center bg-(--brand-green-01) px-3 text-sm font-bold text-white [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]"
              >
                Tilføj
              </Link>
            </div>
            {subscriptions.length === 0 ? (
              <p className="px-4 py-3 text-sm font-semibold text-neutral-400">Intet abonnement</p>
            ) : (
              <div className="divide-y divide-neutral-200">
                {subscriptions.map((sub) => (
                  <SubscriptionRow
                    key={sub.subscription_id}
                    sub={sub}
                    menuOpen={openMenuId === sub.subscription_id}
                    onMenuToggle={() =>
                      setOpenMenuId(openMenuId === sub.subscription_id ? null : sub.subscription_id)
                    }
                    onCloseMenu={() => setOpenMenuId(null)}
                    onCancel={() => { setOpenMenuId(null); setCancelTarget(sub); }}
                  />
                ))}
              </div>
            )}
          </article>

          {/* Betalingskort */}
          <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                  <CreditCard size={16} />
                </span>
                <p className="text-sm font-semibold text-neutral-600">Betalingskort</p>
              </div>
              <Link
                href={`${ROUTES.savePaymentCard}&returnTo=${encodeURIComponent("/profiles")}`}
                className="flex h-8 min-w-24 items-center justify-center bg-(--brand-green-01) px-3 text-sm font-bold text-white [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%)]"
              >
                {savedCardNumber ? "Rediger" : "Tilføj"}
              </Link>
            </div>
            {savedCardNumber ? (
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-neutral-400 shrink-0" />
                  <p className="text-sm font-semibold text-neutral-700">
                    **** **** **** {savedCardNumber.replace(/\s/g, "").slice(-4)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    window.localStorage.removeItem(SAVED_PAYMENT_CARD_STORAGE_KEY);
                    setSavedCardNumber(null);
                  }}
                  className="text-xs font-bold text-red-500"
                >
                  Fjern
                </button>
              </div>
            ) : (
              <p className="px-4 py-3 text-sm font-semibold text-neutral-400">Intet gemt kort</p>
            )}
          </article>

          {/* Klippekort */}
          <article className="overflow-hidden rounded-[3px] bg-(--white-white) shadow-2xl">
            <div className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                  <Ticket size={16} />
                </span>
                <h2 className="text-2xl font-bold text-natural-800">{profilePageNames.clipCardTitle}</h2>
              </div>
              <div className="mt-3 flex items-center gap-2.5">
                {profileStamps.map((stamp, index) => (
                  <Stamp key={`${stamp.label}-${stamp.filled}-${index}`} filled={stamp.filled}>
                    {stamp.label}
                  </Stamp>
                ))}
              </div>
            </div>
            <div className="flex justify-end border-t border-neutral-200">
              <p className="px-4 py-3 text-xs font-semibold text-neutral-600">
                {profilePageNames.clipCardProgress}
              </p>
            </div>
          </article>

          {/* Badges */}
          <article className="rounded-[3px] bg-(--white-white) px-4 py-3 shadow-2xl">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-(--brand-green-01) text-white">
                <Star size={16} />
              </span>
              <div>
                <h2 className="text-2xl font-bold text-natural-800">{profilePageNames.badgesTitle}</h2>
                <p className="text-xs font-semibold text-neutral-600">{profilePageNames.badgesSubtitle}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-start justify-start gap-2">
              {(showBadges ? badges : badges.slice(0, 4)).map((badge) => (
                <button
                  key={badge.id}
                  type="button"
                  onClick={() => setActiveBadgeId(badge.id)}
                  className="w-14 shrink-0 text-center touch-manipulation"
                  aria-label={`Badge: ${badge.label}`}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center">
                    <Image
                      src={badge.achieved ? badge.image : badge.lockedImage || badge.image}
                      alt={badge.label}
                      width={56}
                      height={56}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </button>
              ))}
              {!showBadges && badges.length > 4 && (
                <button
                  type="button"
                  onClick={() => setShowBadges(true)}
                  onPointerUp={() => setShowBadges(true)}
                  aria-label={`Vis ${badges.length - 4} flere badges`}
                  className="relative z-10 flex h-20 w-14 shrink-0 touch-manipulation flex-col items-center justify-start"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-gray-200 text-xs font-bold text-(--brand-green-01)">
                    +{badges.length - 4}
                  </div>
                  <p className="mt-1 text-[10px] leading-tight font-semibold text-neutral-700">
                    {profilePageNames.showAll}
                  </p>
                </button>
              )}
            </div>
            <div className="mt-2 min-h-11 rounded-md bg-neutral-100 px-2 py-1.5 text-center">
              {activeBadge ? (
                <>
                  <p className="text-xs font-bold text-neutral-800">{activeBadge.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug font-semibold text-neutral-600">
                    {activeBadge.description}
                  </p>
                </>
              ) : (
                <p className="text-xs font-semibold text-neutral-700">{profilePageNames.activeBadgeHint}</p>
              )}
            </div>
          </article>

          <button
            type="button"
            onClick={logout}
            className="mx-auto block w-[78%] rounded-[3px] bg-white py-2.5 text-xl font-bold text-red-500 shadow-md"
          >
            {profilePageNames.logout}
          </button>
        </section>
      </main>

      {cancelTarget && (
        <ConfirmModal
          title="Opsig abonnement?"
          message={
            <>
              Er du sikker på, at du vil opsige{" "}
              <span className="font-bold text-neutral-800">{cancelTarget.subscriptions_name}</span>?
              Det udløber ved næste fornyelsesdato.
            </>
          }
          confirmLabel="Opsig"
          onConfirm={handleCancelSubscription}
          onCancel={() => setCancelTarget(null)}
        />
      )}
    </div>
  );
}
