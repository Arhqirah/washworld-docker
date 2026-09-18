// useFavorites er en hjælpefunktion (hook) der giver nem adgang til favoritlisten fra FavoritesContext.tsx.
// FavoritesContext udbydes af FavoritesProvider, som er monteret i Providers.tsx → layout.tsx.
import { useContext } from "react";
import { FavoritesContext } from "@/context/FavoritesContext";

// Returnerer favorites[], isFavorite() og toggleFavorite().
// Bruges i: dashboard/page.tsx (favoritkort), LocationsList.tsx og details/page.tsx (stjerneikonet).
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites skal bruges inden i FavoritesProvider");
  return ctx;
}
