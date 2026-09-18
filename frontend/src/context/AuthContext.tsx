"use client";

// AuthContext håndterer login-session for hele appen.
// JWT-token gemmes i localStorage. Når appen starter, forsøger vi at genbruge
// det gemte token ved at hente friske brugerdata fra API'et – virker det ikke
// (udløbet token, server nede), logges brugeren ud automatisk.
//
// Brug useAuth() hook i en komponent for at tilgå token, user, login og logout.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "@/types/api";
import { fetchAuthUser } from "@/lib/authApi";
import { saveToken, clearToken } from "@/lib/apiClient";
import {
  getUserDisplayFirstName,
  getUserDisplayFullName,
} from "@/lib/formatName";

type AuthContextType = {
  token: string | null;
  user: User | null;
  displayFirstName: string;
  displayFullName: string;
  isLoading: boolean;        // true mens session verificeres ved opstart
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;  // bekvem shorthand: token && user er begge sat
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kører én gang ved opstart og genopretter sessionen fra localStorage.
  // Vi sætter straks det cachede bruger-objekt (hurtig UI) og henter
  // derefter friske data fra API'et i baggrunden.
  // cancelled-flaget forhindrer setState efter komponent er unmountet.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const storedToken = localStorage.getItem("token");
      const storedUserRaw = localStorage.getItem("auth_user");

      if (!storedToken || !storedUserRaw) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      let storedUser: User | null = null;
      try {
        storedUser = JSON.parse(storedUserRaw) as User;
      } catch {
        // Ugyldig JSON i localStorage – ryd op og lad brugeren logge ind igen
        clearToken();
        localStorage.removeItem("auth_user");
        if (!cancelled) setIsLoading(false);
        return;
      }

      // Vis cachede data med det samme mens vi venter på API'et
      // Sørg for at cookie også er sat, så middleware kender session
      saveToken(storedToken);
      setToken(storedToken);
      setUser(storedUser);

      try {
        // Verificer token ved at hente friske brugerdata
        const freshUser = await fetchAuthUser(storedUser.user_id);
        if (!cancelled) {
          setUser(freshUser);
          localStorage.setItem("auth_user", JSON.stringify(freshUser));
        }
      } catch {
        // Token er udløbet eller ugyldigt – log ud
        if (!cancelled) {
          clearToken();
          localStorage.removeItem("auth_user");
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Gemmer token og bruger i localStorage og opdaterer React-state.
  // Kaldes fra login-siden og signup-siden efter vellykket API-kald.
  function login(newToken: string, newUser: User) {
    saveToken(newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    setIsLoading(false);
  }

  // Rydder al session-data og sender brugeren til login-siden.
  function logout() {
    clearToken();
    localStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        displayFirstName: getUserDisplayFirstName(user),
        displayFullName: getUserDisplayFullName(user),
        isLoading,
        login,
        logout,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

