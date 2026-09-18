// useAuth er en hjælpefunktion (hook) der giver nem adgang til login-data fra AuthContext.tsx.
// AuthContext udbydes af AuthProvider, som er monteret i Providers.tsx → layout.tsx.
// Kaster en fejl hvis den bruges uden for AuthProvider, så vi opdager fejl tidligt.
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

// Returnerer token, user, login(), logout(), displayFirstName og displayFullName.
// Bruges bl.a. i: dashboard/page.tsx, profile/page.tsx, updateprofile/page.tsx,
// VehiclesContext.tsx og overalt hvor brugerstatus eller brugerdata er nødvendigt.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth skal bruges inden i AuthProvider");
  return ctx;
}
