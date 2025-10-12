import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { shopService } from "./service";
import { getProductsSchemaRefined } from "./dto";
import type { ShopProductsResponse } from "./types";

/**
 * GET /api/shop
 * Retrieves products with filtering, sorting, and pagination.
 *
 * Query Parameters:
 * - page (optional): Page number (default: 1)
 * - limit (optional): Items per page (default: 10, max: 100)
 * - sortDirection (optional): "asc" | "desc" (default: "asc")
 * - sortField (optional): "createdAt" | "updatedAt" | "title" | "price" | "availableForSale" (default: "createdAt")
 * - search (optional): Search term for title/description
 * - category (optional): Filter by category name
 * - priceMin (optional): Minimum price filter (in cents)
 * - priceMax (optional): Maximum price filter (in cents)
 * - availableForSale (optional): Filter by availability (true/false)
 *
 * @param request - The incoming request
 * @returns Paginated products with filtering and sorting applied
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<ShopProductsResponse | unknown>> {
  try {
    // Step 1: Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams;

    const queryParams = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : undefined,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : undefined,
      sortDirection: searchParams.get("sortDirection") as
        | "asc"
        | "desc"
        | undefined,
      sortField: searchParams.get("sortField") as
        | "createdAt"
        | "updatedAt"
        | "title"
        | "price"
        | "availableForSale"
        | undefined,
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      priceMin: searchParams.get("priceMin")
        ? Number.parseInt(searchParams.get("priceMin")!)
        : undefined,
      priceMax: searchParams.get("priceMax")
        ? Number.parseInt(searchParams.get("priceMax")!)
        : undefined,
      availableForSale: searchParams.get("availableForSale")
        ? searchParams.get("availableForSale") === "true"
        : undefined,
    };

    const validatedDto = getProductsSchemaRefined.parse(queryParams);

    // Step 2: Get products from service
    const productsData = await shopService.getProducts({ dto: validatedDto });

    return NextResponse.json(
      {
        success: true,
        data: productsData,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
