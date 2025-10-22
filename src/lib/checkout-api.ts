import { CartResponse } from "@/app/api/cart/types";
import { BASE_URL } from "./utils";
import { CheckoutResponse } from "@/app/api/cart/checkout/dto";

/**
 * Completes the checkout process.
 */
export async function completeCheckout(): Promise<CheckoutResponse> {
  const response = await fetch(`${BASE_URL}/api/cart/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Failed to complete checkout",
    }));
    throw new Error(error.message || "Failed to complete checkout");
  }

  return response.json();
}
