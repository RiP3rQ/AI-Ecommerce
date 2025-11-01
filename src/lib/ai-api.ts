/**
 * Client-side AI API utilities.
 * These functions call the AI API endpoints from the browser.
 */

import { BASE_URL } from "./utils";
import type { SuggestProductsResponse } from "@/app/api/ai/suggest-products/types";

/**
 * Gets AI-powered product suggestions based on cart items.
 */
export async function getProductSuggestions(): Promise<SuggestProductsResponse> {
  const response = await fetch(`${BASE_URL}/api/ai/suggest-products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Failed to get product suggestions",
    }));
    throw new Error(error.message || "Failed to get product suggestions");
  }

  return response.json();
}
