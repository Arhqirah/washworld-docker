// apiClient er det centrale lag til alle HTTP-kald mod backend.
// Al kommunikation med API'et bør gå igennem apiRequest() så vi sikrer:
//   1. Korrekt base-URL fra miljøvariablen NEXT_PUBLIC_API_BASE_URL
//   2. JWT-token sendes automatisk med i Authorization-headeren
//   3. 401-fejl (udløbet session) redirecter automatisk til /login
//   4. Fejlbeskeder fra API'et bobles op som normale JS-fejl

import type { ApiError } from "@/types/api";

// Henter base-URL fra .env.local. Kastes som fejl ved opstart hvis den mangler,
// så man opdager konfigurationsfejl med det samme frem for mystiske netværksfejl.
function getBase(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base?.trim()) throw new Error("NEXT_PUBLIC_API_BASE_URL er ikke sat");
  return base.replace(/\/$/, ""); // fjern evt. afsluttende skråstreg
}

// Læser token fra localStorage. Returnerer null under SSR (ingen window).
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function saveToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  document.cookie = `token=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  document.cookie = "token=; path=/; max-age=0";
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Undgå redirect til /login ved 401 (fx ved forkert kodeord på login-siden). */
  skipAuthRedirect?: boolean;
};

// Generisk fetch-wrapper. Alle API-funktioner i /lib kalder denne.
// T er typen på det forventede JSON-svar, fx Subscription[] eller AuthResponse.
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, skipAuthRedirect = false } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Vedhæft JWT-token hvis brugeren er logget ind
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${getBase()}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    // Prøv at læse fejlbeskeden fra API-svaret (har feltnavnet "message" eller "error")
    let errorMsg = `Fejl ${res.status}`;
    try {
      const data = (await res.json()) as ApiError;
      errorMsg = data.message ?? data.error ?? errorMsg;
    } catch {
      // ignore parse errors
    }

    if (res.status === 401) {
      if (!skipAuthRedirect) {
        // Token er udløbet – ryd op og send til login
        clearToken();
        if (typeof window !== "undefined") window.location.href = "/login";
        throw new Error("Ikke autoriseret — log ind igen");
      }
      throw new Error(errorMsg);
    }

    throw new Error(errorMsg);
  }

  // 204 No Content – serveren returnerer intet JSON-body
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
