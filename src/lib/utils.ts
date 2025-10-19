import { clsx, type ClassValue } from "clsx";
import { ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 * Formats a price object with amount in minor units (e.g., cents) and currency code.
 * Example: { price: 999, currencyCode: 'USD' } => "$9.99"
 * Handles invalid or missing values gracefully.
 */
export function formatBasicPrice({ price }: { price?: number | null }): string {
  return price?.toFixed(2) ?? "";
}

/**
 * Formats a price object with amount in minor units (e.g., cents) and currency code.
 * Example: { price: 999, currencyCode: 'USD' } => "$9.99"
 * Handles invalid or missing values gracefully.
 */
export function formatFullPrice({
  price,
  currencyCode,
}: {
  price?: number | null;
  currencyCode?: string | null;
}): string {
  if (
    typeof price !== "number" ||
    !isFinite(price) ||
    price < 0 ||
    !currencyCode ||
    typeof currencyCode !== "string"
  ) {
    return "";
  }

  // Convert minor units (e.g., cents) to major units (e.g., dollars)
  const majorUnit = price / 100;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(majorUnit);
  } catch {
    // Fallback for invalid currency codes or formatting errors
    return `${majorUnit.toFixed(2)} ${currencyCode}`;
  }
}

/**
 * The base URL of the application.
 * This is used to generate the metadata for the application.
 * VERCEL_PROJECT_PRODUCTION_URL - is the production URL of the application provided by Vercel.
 * http://localhost:3000 - is the local development URL.
 */
export const BASE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/**
 * Creates a URL with query parameters.
 * @param pathname - The pathname of the URL.
 * @param params - The query parameters.
 * @returns The URL with query parameters.
 */
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};
