// subscriptionsApi indeholder alle API-kald relateret til abonnementer.
// Alle funktioner bruger apiRequest() som håndterer token og fejl automatisk.

import { apiRequest } from "@/lib/apiClient";
import type { Subscription } from "@/types/api";

// Henter alle abonnementer i systemet (bruges på profilsiden til at finde brugerens aktive abonnement).
export async function fetchSubscriptions(): Promise<Subscription[]> {
  const data = await apiRequest<{ subscriptions: Subscription[] }>("/api/subscriptions");
  return data.subscriptions;
}

// Henter abonnementer knyttet til en specifik bruger via et JOIN med cars-tabellen.
// Virker kun hvis brugeren har et køretøj registreret i databasen.
export async function fetchUserSubscriptions(userId: string): Promise<Subscription[]> {
  const data = await apiRequest<{ subscriptions: Subscription[] }>(
    `/api/users/${encodeURIComponent(userId)}/subscriptions`,
  );
  return data.subscriptions;
}

// Dataform til oprettelse af et nyt abonnement.
// product_id og car_id er valgfrie – car_id skal matche en række i cars-tabellen.
export type CreateSubscriptionInput = {
  product_id?: string;
  car_id?: string;
  subscription_name: string;
  subscription_price: number;
  subscription_status: string;
  subscription_start_date: string;
  subscription_end_date: string;
  subscription_next_billing_date: string;
};

// Opretter et nyt abonnement og returnerer det nye subscription_id fra serveren.
export async function createSubscription(
  input: CreateSubscriptionInput,
): Promise<{ message: string; subscription_id: string }> {
  return apiRequest("/api/subscriptions", { method: "POST", body: input });
}

// Dataform til opdatering af et eksisterende abonnement (fx opsigelse ændrer status til "opsagt").
export type UpdateSubscriptionInput = {
  subscription_status: string;
  subscription_end_date: string;
  subscription_next_billing_date: string;
};

// Opdaterer status og datoer på et abonnement.
export async function updateSubscription(
  subscriptionId: string,
  input: UpdateSubscriptionInput,
): Promise<{ message: string }> {
  return apiRequest(`/api/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "PUT",
    body: input,
  });
}

// Sletter (opsiger) et abonnement permanent.
export async function deleteSubscription(
  subscriptionId: string,
): Promise<{ message: string }> {
  return apiRequest(`/api/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "DELETE",
  });
}
