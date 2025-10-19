import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { productService } from "./service";
import {
  createTestableUnit,
  dbHelpers,
  createTestDb,
} from "@/test/utils/db-helper";
import {
  createProductFixture,
  createProductVariantFixture,
  createProductVariantFixtures,
} from "@/test/fixtures/products";
import { createProductImageFixtures } from "@/test/fixtures/product-images";
import { createProductOptionFixtures } from "@/test/fixtures/product-options";
import type { ProductResponse } from "./types";
import { mockValidateServerSession } from "@/test/setup/test-setup";
import { UnauthorizedError } from "@/lib/errors/cart-errors";
import { faker } from "@faker-js/faker";

/**
 * Comprehensive test suite for the product API endpoint.
 * Tests cover default behavior, data transformation, edge cases, and error handling.
 */
describe("/api/product/[productUuid]", () => {
  beforeAll(async () => {
    await dbHelpers.truncateProductTables();
  });

  afterAll(async () => {
    await dbHelpers.truncateProductTables();
  });

  beforeEach(async () => {
    // Ensure clean state before each test
    await dbHelpers.truncateProductTables();
    mockValidateServerSession.mockClear();
  });

  describe("GET /api/product/[productUuid]", () => {
    describe("Successful Product Retrieval", () => {
      it("should return a product with all related data (variants, images, options)", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create a complete product with all related data
          const product = await createProductFixture({
            db,
            overrides: {
              title: "Test Product",
              description: "Test Description",
            },
          });

          // Create variants with different prices
          await createProductVariantFixtures({
            db,
            count: 3,
            overrides: [
              { productId: product.id, price: 1000, title: "Small" },
              { productId: product.id, price: 1500, title: "Medium" },
              { productId: product.id, price: 2000, title: "Large" },
            ],
          });

          // Create images with specific order
          await createProductImageFixtures({
            db,
            count: 3,
            overrides: [
              { productId: product.id, order: 2, altText: "Image 2" },
              { productId: product.id, order: 0, altText: "Image 0" },
              { productId: product.id, order: 1, altText: "Image 1" },
            ],
          });

          // Create options
          await createProductOptionFixtures({
            db,
            count: 2,
            overrides: [
              {
                productId: product.id,
                name: "Size",
                position: 1,
                values: ["S", "M", "L"],
              },
              {
                productId: product.id,
                name: "Color",
                position: 0,
                values: ["Red", "Blue"],
              },
            ],
          });

          // Act: Call service
          const result = await productService.getProduct({
            dto: { id: product.id },
            db,
          });

          // Assert: Product data is returned
          expect(result.id).toBe(product.id);
          expect(result.title).toBe("Test Product");
          expect(result.description).toBe("Test Description");

          // Assert: Variants are present and sorted/deduplicated
          expect(result.product_variants).toHaveLength(3);
          expect(result.product_variants.map((v) => v.title)).toEqual([
            "Small",
            "Medium",
            "Large",
          ]);

          // Assert: Images are present and sorted by order
          expect(result.product_images).toHaveLength(3);
          expect(result.product_images[0].order).toBe(0);
          expect(result.product_images[1].order).toBe(1);
          expect(result.product_images[2].order).toBe(2);

          // Assert: Options are present and sorted by position
          expect(result.product_options).toHaveLength(2);
          expect(result.product_options[0].name).toBe("Color"); // position 0
          expect(result.product_options[1].name).toBe("Size"); // position 1

          // Assert: Price range is calculated correctly
          expect(result.priceRange.minVariantPrice.amount).toBe(1000);
          expect(result.priceRange.maxVariantPrice.amount).toBe(2000);
          expect(result.priceRange.minVariantPrice.currencyCode).toBe("USD");
          expect(result.priceRange.maxVariantPrice.currencyCode).toBe("USD");
        });
      });

      it("should handle products with no variants", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product without variants
          const product = await createProductFixture({
            db,
            overrides: { title: "Product Without Variants" },
          });

          // Act: Call service
          const result = await productService.getProduct({
            dto: { id: product.id },
            db,
          });

          // Assert: Product data is returned
          expect(result.id).toBe(product.id);
          expect(result.product_variants).toHaveLength(0);

          // Assert: Price range defaults to 0
          expect(result.priceRange.minVariantPrice.amount).toBe(0);
          expect(result.priceRange.maxVariantPrice.amount).toBe(0);
        });
      });

      it("should handle products with no images", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product without images
          const product = await createProductFixture({
            db,
            overrides: { title: "Product Without Images" },
          });

          // Act: Call service
          const result = await productService.getProduct({
            dto: { id: product.id },
            db,
          });

          // Assert: Product data is returned
          expect(result.product_images).toHaveLength(0);
        });
      });

      it("should handle products with no options", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product without options
          const product = await createProductFixture({
            db,
            overrides: { title: "Product Without Options" },
          });

          // Act: Call service
          const result = await productService.getProduct({
            dto: { id: product.id },
            db,
          });

          // Assert: Product data is returned
          expect(result.product_options).toHaveLength(0);
        });
      });

      it("should correctly calculate price range with single variant", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product with single variant
          const product = await createProductFixture({
            db,
            overrides: { title: "Single Variant Product" },
          });

          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 2500,
              currencyCode: "EUR",
            },
          });

          // Act: Call service
          const result = await productService.getProduct({
            dto: { id: product.id },
            db,
          });

          // Assert: Price range shows same min/max
          expect(result.priceRange.minVariantPrice.amount).toBe(2500);
          expect(result.priceRange.maxVariantPrice.amount).toBe(2500);
          expect(result.priceRange.minVariantPrice.currencyCode).toBe("EUR");
          expect(result.priceRange.maxVariantPrice.currencyCode).toBe("EUR");
        });
      });
    });

    describe("Data Deduplication", () => {
      it("should deduplicate variants with same ID", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product and variants
          const product = await createProductFixture({
            db,
            overrides: { title: "Deduplication Test" },
          });

          const variant1 = await createProductVariantFixture({
            db,
            overrides: { productId: product.id, title: "Variant 1" },
          });

          // Create another variant
          await createProductVariantFixture({
            db,
            overrides: { productId: product.id, title: "Variant 2" },
          });

          // Act: Call service
          const result = await productService.getProduct({
            dto: { id: product.id },
            db,
          });

          // Assert: All variants are present without duplicates
          expect(result.product_variants).toHaveLength(2);
          const variantIds = result.product_variants.map((v) => v.id);
          expect(new Set(variantIds)).toHaveLength(2); // No duplicates
        });
      });

      it("should deduplicate images with same ID", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product and images
          const product = await createProductFixture({
            db,
            overrides: { title: "Image Deduplication Test" },
          });

          await createProductImageFixtures({
            db,
            count: 3,
            overrides: [
              { productId: product.id, order: 0 },
              { productId: product.id, order: 1 },
              { productId: product.id, order: 2 },
            ],
          });

          // Act: Call service
          const result = await productService.getProduct({
            dto: { id: product.id },
            db,
          });

          // Assert: All images are present without duplicates
          expect(result.product_images).toHaveLength(3);
          const imageIds = result.product_images.map((img) => img.id);
          expect(new Set(imageIds)).toHaveLength(3); // No duplicates
        });
      });
    });

    describe("Error Handling", () => {
      it("should throw ProductNotFoundError for non-existent product", async () => {
        await createTestableUnit(async (db) => {
          // Act & Assert: Call service with non-existent UUID
          await expect(
            productService.getProduct({
              dto: { id: "non-existent-uuid" },
              db,
            }),
          ).rejects.toThrow("Product not found");
        });
      });

      it("should throw validation error for invalid UUID format", async () => {
        await createTestableUnit(async (db) => {
          // Act & Assert: Call service with invalid UUID
          await expect(
            productService.getProduct({
              dto: { id: "invalid-uuid" },
              db,
            }),
          ).rejects.toThrow(); // Zod validation error
        });
      });
    });
  });

  describe("Integration Tests - Route Handler", () => {
    describe("GET /api/product/[productUuid]", () => {
      it("should return product data with proper response format", async () => {
        // Arrange: Mock successful authentication
        mockValidateServerSession.mockResolvedValue({ id: "user-123" });

        // Arrange: Seed product data
        const db = createTestDb();
        let productId: string;
        const product = await createProductFixture({
          db,
          overrides: { title: "Integration Test Product" },
        });
        productId = product.id;

        await createProductVariantFixture({
          db,
          overrides: { productId: product.id, price: 3000 },
        });

        // Act: Make GET request to product endpoint
        const request = new NextRequest(
          `http://localhost:3000/api/product/${productId}`,
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: productId }),
        });
        const result = (await response.json()) as ProductResponse;

        // Assert: Response status is 200
        expect(response.status).toBe(200);

        // Assert: Response has correct structure
        expect(result.success).toBe(true);
        expect(result.data).toBeDefined();
        expect(result.data.id).toBe(productId);
        expect(result.data.title).toBe("Integration Test Product");
        expect(result.data.product_variants).toHaveLength(1);
      });

      it("should return 404 for non-existent product", async () => {
        // Arrange: Mock successful authentication
        mockValidateServerSession.mockResolvedValue({ id: "user-123" });

        const productId = faker.string.uuid();

        // Act: Make GET request for non-existent product
        const request = new NextRequest(
          `http://localhost:3000/api/product/${productId}`,
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: productId }),
        });
        const result = await response.json();

        // Assert: Response status is 404
        expect(response.status).toBe(404);
        expect(result.message).toContain("Product with");
        expect(result.message).toContain(productId);
        expect(result.message).toContain("not found");
      });

      it("should return 401 when user is not authenticated", async () => {
        // Arrange: Mock authentication failure
        mockValidateServerSession.mockRejectedValue(new UnauthorizedError());

        // Act: Make GET request to product endpoint
        const response = await GET(
          new NextRequest("http://localhost:3000/api/product/some-uuid"),
          {
            params: Promise.resolve({
              id: faker.string.uuid().toString(),
            }),
          },
        );
        const result = await response.json();

        // Assert: Response status is 401
        expect(response.status).toBe(401);
        expect(result.message).toBe("User is not authenticated.");
      });

      it("should return 403 for invalid UUID format", async () => {
        // Arrange: Mock successful authentication
        mockValidateServerSession.mockResolvedValue({ id: "user-123" });

        // Act: Make GET request with invalid UUID
        const request = new NextRequest(
          "http://localhost:3000/api/product/invalid-uuid",
        );
        const response = await GET(request, {
          params: Promise.resolve({ id: "invalid-uuid" }),
        });
        const result = await response.json();

        // Assert: Response status is 403
        expect(response.status).toBe(403);
        expect(result.message).toBe("Input validation failed");
        expect(result.errors.id).toContain("Invalid product UUID format");
      });
    });
  });
});
