// useUpdateProfile – al formular-logik til opdatering af brugerprofil.
// Håndterer forudfyldning fra AuthContext, gem, sletning og fejltilstande.
// Returnerer formState, handlere og UI-tilstande til UpdateProfilePage.

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks";
import { updateAuthUser, deleteAuthUser } from "@/lib/authApi";
import { parsePhone, validateLocalPhone } from "@/lib/phoneUtils";
import { ROUTES } from "@/lib/routes";

export type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  dialCode: string;
  localPhone: string;
};

export function useUpdateProfile() {
  const router = useRouter();
  const { user, login, logout, token, displayFullName } = useAuth();

  const [formState, setFormState] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    dialCode: "+45",
    localPhone: "",
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Forudfyld formularen med brugerens nuværende data første gang user er tilgængelig.
  const [prevUser, setPrevUser] = useState(user);
  if (user !== prevUser && user) {
    setPrevUser(user);
    const { dialCode, localPhone } = parsePhone(user.user_phone ?? "");
    setFormState({
      firstName: user.user_firstname,
      lastName: user.user_lastname,
      email: user.user_email,
      dialCode,
      localPhone,
    });
  }

  function handleInputChange(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    if (field === "localPhone") setPhoneError(null);
  }

  async function handleSave() {
    if (!user || !token) return;

    const phoneValidation = validateLocalPhone(formState.localPhone, formState.dialCode);
    if (phoneValidation) {
      setPhoneError(phoneValidation);
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      const fullPhone = `${formState.dialCode} ${formState.localPhone.replace(/[\s\-]/g, "")}`;
      const updated = await updateAuthUser(user.user_id, {
        user_firstname: formState.firstName,
        user_lastname: formState.lastName,
        user_email: formState.email,
        user_phone: fullPhone,
      });
      // Opdater AuthContext med de nye brugerdata så resten af appen ser de nye værdier
      login(token, updated);
      router.push(ROUTES.profileUpdated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke gemme ændringer");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    if (!user || !token) return;
    setIsDeleting(true);
    setError(null);
    try {
      await deleteAuthUser(user.user_id);
      logout();
      router.push(ROUTES.login);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kunne ikke slette konto");
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  }

  return {
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
  };
}
