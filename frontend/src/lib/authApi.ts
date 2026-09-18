// authApi indeholder alle API-kald til brugerstyring: login, oprettelse og profilopdatering.
// Alle kald bruger apiRequest() fra apiClient, som vedhæfter token og håndterer fejl.

import { apiRequest } from "@/lib/apiClient";
import type { AuthResponse, User } from "@/types/api";

// Validerer at API-svaret har det forventede format (token + user_id).
// Kaster fejl tidligt frem for at lade tomme felter skabe mystiske fejl længere nede.
function normalizeAuthResponse(data: AuthResponse): AuthResponse {
  if (!data?.token || !data?.user?.user_id) {
    throw new Error("Uventet svar fra serveren");
  }
  return data;
}

// Logger brugeren ind og returnerer JWT-token + brugerdata.
// skipAuthRedirect forhindrer at et forkert kodeord sender brugeren til /login.
export async function loginUser(
  user_email: string,
  user_password: string,
): Promise<AuthResponse> {
  const data = await apiRequest<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: { user_email, user_password },
    skipAuthRedirect: true,
  });
  return normalizeAuthResponse(data);
}

// Opretter en ny bruger. Backend sender en verificeringsmail og kræver at brugeren
// bekræfter sin email inden login. Returnerer en besked om at tjekke email.
export async function registerUser(data: {
  user_firstname: string;
  user_lastname: string;
  user_email: string;
  user_password: string;
  user_phone?: string;
}): Promise<{ message: string; user_id: string }> {
  return apiRequest<{ message: string; user_id: string }>("/api/auth/register", {
    method: "POST",
    body: data,
    skipAuthRedirect: true,
  });
}

// Opdaterer brugerens profil (navn, email, telefon, evt. nyt kodeord).
// Kræver at brugeren er logget ind – token sendes automatisk med af apiRequest.
export async function updateAuthUser(
  userId: string,
  data: { user_firstname: string; user_lastname: string; user_email: string; user_phone: string; user_password?: string },
): Promise<User> {
  return apiRequest<User>(`/api/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: data,
  });
}

// Sletter brugerens konto (soft delete — sætter user_deleted_at i databasen).
export async function deleteAuthUser(userId: string): Promise<void> {
  await apiRequest(`/api/users/${encodeURIComponent(userId)}`, {
    method: "DELETE",
  });
}

// Sender en nulstillingsmail til brugeren (POST /api/auth/forgot-password).
// Fejler lydstille på siden af sikkerhedshensyn — API'et afslører ikke om emailen eksisterer.
export async function requestPasswordReset(user_email: string): Promise<void> {
  await apiRequest("/api/auth/forgot-password", {
    method: "POST",
    body: { user_email },
    skipAuthRedirect: true,
  });
}

// Sætter en ny adgangskode med reset-nøglen fra nulstillingslinket (POST /api/auth/reset-password).
export async function confirmPasswordReset(reset_key: string, user_password: string): Promise<void> {
  await apiRequest("/api/auth/reset-password", {
    method: "POST",
    body: { reset_key, user_password },
    skipAuthRedirect: true,
  });
}

// Henter friske brugerdata fra databasen (`GET /api/users/<user_id>`).
// Bruges ved opstart i AuthContext til at verificere at det gemte token stadig er gyldigt.
// Svaret kan komme indpakket i { user: ... } eller direkte som User-objekt afhængigt af API-versionen.
export async function fetchAuthUser(userId: string): Promise<User> {
  const data = await apiRequest<{ user: User } | User>(
    `/api/users/${encodeURIComponent(userId)}`,
  );
  if (data && typeof data === "object" && "user" in data && data.user) {
    return data.user;
  }
  return data as User;
}
