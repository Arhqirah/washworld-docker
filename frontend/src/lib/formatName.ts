// formatName – hjælpefunktioner til at formatere brugernavne til visning.
// getUserDisplayFirstName() og getUserDisplayFullName() bruges af AuthContext.tsx,
// som udstiller dem via useAuth()-hooken (displayFirstName, displayFullName).
// capitalizeName() bruges i updateprofile/page.tsx til at sætte stort forbogstav.
import type { User } from "@/types/api";

type UserNameFields = Pick<User, "user_firstname" | "user_lastname">;

/** Gør første bogstav stort og resten små (fx "andreas" → "Andreas"). */
export function capitalizeName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  return (
    trimmed.charAt(0).toLocaleUpperCase("da-DK") +
    trimmed.slice(1).toLocaleLowerCase("da-DK")
  );
}

export function formatFullName(firstName: string, lastName: string): string {
  return [capitalizeName(firstName), capitalizeName(lastName)]
    .filter(Boolean)
    .join(" ");
}

/** Formaterer et navn der kan bestå af flere ord (fx "andreas buch" → "Andreas Buch"). */
export function formatDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  return trimmed.split(/\s+/).map(capitalizeName).join(" ");
}

export function getUserDisplayFirstName(
  user: UserNameFields | null | undefined,
): string {
  if (!user?.user_firstname) return "";
  return capitalizeName(user.user_firstname);
}

export function getUserDisplayFullName(
  user: UserNameFields | null | undefined,
): string {
  if (!user) return "";
  return formatFullName(user.user_firstname, user.user_lastname);
}
