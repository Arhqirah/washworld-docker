// FavoritesContext holder styr på hvilke vaskelocations brugeren har gemt som favoritter.
// Listen hentes fra API'et første gang brugeren logger ind, og opdateres straks i UI'et
// (optimistic update) når brugeren trykker stjerne — selv hvis netværket er langsomt.
//
// Brug useFavorites() hook for at tjekke om en lokation er favorit og for at skifte den.

"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AuthContext } from "@/context/AuthContext";
import { apiRequest } from "@/lib/apiClient";

// Det som FavoritesContext stiller til rådighed for resten af appen
type FavoritesContextType = {
  favorites: string[];                          // Liste af lokations-ID'er som er gemt som favoritter
  isFavorite: (id: string) => boolean;          // Tjekker om en given lokation er favorit
  toggleFavorite: (id: string) => Promise<void>; // Tilføjer eller fjerner en favorit
};

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const auth = useContext(AuthContext);
  const [favorites, setFavorites] = useState<string[]>([]);
  // loadedForRef holder styr på hvilken bruger vi sidst hentede favoritter for,
  // så vi ikke henter dem igen unødvendigt hvis komponenten re-renderer
  const loadedForRef = useRef<string | null>(null);

  const userId = auth?.user?.user_id ?? null;
  const authToken = auth?.token ?? null;

  // Nulstil favoritter når brugeren logger ud ("setState during render"-mønster)
  const [prevUserId, setPrevUserId] = useState<string | null>(userId);
  if (userId !== prevUserId) {
    setPrevUserId(userId);
    if (!userId || !authToken) {
      setFavorites([]);
    }
  }

  // Henter favoritter fra API'et første gang en bruger er logget ind.
  useEffect(() => {
    if (!userId || !authToken) return;
    if (loadedForRef.current === userId) return;
    loadedForRef.current = userId;

    apiRequest<{ favorites: string[] }>(`/api/users/${userId}/favorites`)
      .then((data) => setFavorites(data.favorites))
      .catch(() => setFavorites([]));
  }, [userId, authToken]);

  // Tilføjer eller fjerner en lokation fra favoritlisten.
  // Opdaterer UI'et med det samme (optimistic update) og ruller tilbage hvis API-kaldet fejler.
  async function toggleFavorite(id: string) {
    const userId = auth?.user?.user_id;
    if (!userId) return;

    const isCurrentlyFav = favorites.includes(id);

    // Opdater UI'et med det samme så det føles hurtigt
    setFavorites((prev) =>
      isCurrentlyFav ? prev.filter((f) => f !== id) : [...prev, id],
    );

    try {
      if (isCurrentlyFav) {
        // Fjern fra favoritter
        await apiRequest(`/api/users/${userId}/favorites/${id}`, { method: "DELETE" });
      } else {
        // Tilføj til favoritter
        await apiRequest(`/api/users/${userId}/favorites`, {
          method: "POST",
          body: { location_id: id },
        });
      }
    } catch {
      // Hvis API-kaldet fejler, fortryd den optimistiske opdatering
      setFavorites((prev) =>
        isCurrentlyFav ? [...prev, id] : prev.filter((f) => f !== id),
      );
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite: (id) => favorites.includes(id),
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
