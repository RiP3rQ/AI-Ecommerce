import { type NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errors";
import { shopService } from "./service";
import { GetProductsDto, getProductsSchemaRefined } from "./dto";
import type { ShopProductsResponse } from "./types";
import { drizzleDbClient } from "@/database";

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

    let queryParams: Partial<GetProductsDto> = {
      page: searchParams.get("page")
        ? Number.parseInt(searchParams.get("page")!)
        : 1,
      limit: searchParams.get("limit")
        ? Number.parseInt(searchParams.get("limit")!)
        : 10,
      search: searchParams.get("search") || undefined,
      categoryId: searchParams.get("categoryId") || undefined,
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

    // Only add sortDirection if present
    const sortDirectionParam = searchParams.get("sortDirection");
    if (sortDirectionParam) {
      queryParams.sortDirection = sortDirectionParam as "asc" | "desc";
    }

    // Only add sortField if present
    const sortFieldParam = searchParams.get("sortField");
    if (sortFieldParam) {
      queryParams.sortField = sortFieldParam as
        | "createdAt"
        | "updatedAt"
        | "title"
        | "price"
        | "availableForSale";
    }

    const validatedDto = getProductsSchemaRefined.parse(queryParams);

    // Step 2: Get products from service
    const productsData = await shopService.getProducts({
      dto: validatedDto,
      db: drizzleDbClient(),
    });

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
