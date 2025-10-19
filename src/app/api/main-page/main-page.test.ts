import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  vi,
} from "vitest";
import { GET } from "./route";
import { mainPageService } from "./service";
import {
  createTestableUnit,
  dbHelpers,
  createTestDb,
} from "@/test/utils/db-helper";
import {
  createProductFixture,
  createProductVariantFixture,
} from "@/test/fixtures/products";
import { createProductImageFixture } from "@/test/fixtures/product-images";
import type { MainPageResponse } from "./types";
import { mockValidateServerSession } from "@/test/setup/test-setup";
import { UnauthorizedError } from "@/lib/errors/cart-errors";
import { createCategoryFixture } from "@/test/fixtures/categories";
import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";

/**
 * Comprehensive test suite for the main-page API endpoint.
 * Tests cover default behavior, data retrieval, authentication, and error handling.
 */
describe("/api/main-page", () => {
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

  describe("GET /api/main-page", () => {
    describe("Default Behavior", () => {
      it("should return the latest 3 products with joined data", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create 4 products with different creation times
          const baseTime = new Date();
          const products = await Promise.all([
            createProductFixture({
              db,
              overrides: {
                title: "Product 1",
                createdAt: new Date(baseTime.getTime() - 4000),
              },
            }),
            createProductFixture({
              db,
              overrides: {
                title: "Product 2",
                createdAt: new Date(baseTime.getTime() - 3000),
              },
            }),
            createProductFixture({
              db,
              overrides: {
                title: "Product 3",
                createdAt: new Date(baseTime.getTime() - 2000),
              },
            }),
            createProductFixture({
              db,
              overrides: {
                title: "Product 4",
                createdAt: baseTime, // newest
              },
            }),
          ]);

          // Create product images for some products (order = 1 for main image)
          await createProductImageFixture({
            db,
            overrides: {
              productId: products[3].id, // Product 4 (newest)
              order: 1,
              url: "https://example.com/image4.jpg",
            },
          });
          await createProductImageFixture({
            db,
            overrides: {
              productId: products[2].id, // Product 3
              order: 1,
              url: "https://example.com/image3.jpg",
            },
          });

          // Create product variants for some products
          await createProductVariantFixture({
            db,
            overrides: {
              productId: products[3].id, // Product 4
              title: "Variant 4",
              price: 10000,
            },
          });
          await createProductVariantFixture({
            db,
            overrides: {
              productId: products[1].id, // Product 2
              title: "Variant 2",
              price: 5000,
            },
          });

          // Act: Call service
          const result = await mainPageService.getLatestProducts({
            db,
            dto: {
              limit: 3,
              skipFirstNumberOfProducts: 0,
            },
          });

          // Assert: Returns exactly 3 products (latest first)
          expect(result).toHaveLength(3);

          // Assert: Products are ordered by createdAt desc (newest first)
          expect(result[0].products.title).toBe("Product 4");
          expect(result[1].products.title).toBe("Product 3");
          expect(result[2].products.title).toBe("Product 2");

          // Assert: Product 4 has main image and variant
          expect(result[0].product_images?.url).toBe(
            "https://example.com/image4.jpg",
          );
          expect(result[0].product_variants?.title).toBe("Variant 4");

          // Assert: Product 3 has main image but no variant
          expect(result[1].product_images?.url).toBe(
            "https://example.com/image3.jpg",
          );
          expect(result[1].product_variants).toBeNull();

          // Assert: Product 2 has variant but no main image
          expect(result[2].product_images).toBeNull();
          expect(result[2].product_variants?.title).toBe("Variant 2");
        });
      });

      it("should return empty array when no products exist", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: No products created

          // Act: Call service
          const result = await mainPageService.getLatestProducts({
            db,
            dto: {
              limit: 3,
              skipFirstNumberOfProducts: 0,
            },
          });

          // Assert: Returns empty array
          expect(result).toEqual([]);
        });
      });

      it("should return all products when fewer than 3 exist", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create only 2 products
          await createProductFixture({
            db,
            overrides: { title: "Product 1" },
          });
          await createProductFixture({
            db,
            overrides: { title: "Product 2" },
          });

          // Act: Call service
          const result = await mainPageService.getLatestProducts({
            db,
            dto: {
              limit: 3,
              skipFirstNumberOfProducts: 0,
            },
          });

          // Assert: Returns exactly 2 products
          expect(result).toHaveLength(2);
          expect(result[0].products.title).toBe("Product 2"); // newer first
          expect(result[1].products.title).toBe("Product 1");
        });
      });

      it("should return 20 products skipping the first 3 when using limit=20 and offset=3", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create 25 products with different creation times
          const baseTime = new Date();
          const products = [];
          for (let i = 1; i <= 25; i++) {
            const product = await createProductFixture({
              db,
              overrides: {
                title: `Product ${i}`,
                createdAt: new Date(baseTime.getTime() - (25 - i) * 1000), // Product 25 is newest, Product 1 is oldest
              },
            });
            products.push(product);
          }

          // Act: Call service with limit=20 and skipFirstNumberOfProducts=3
          const result = await mainPageService.getLatestProducts({
            db,
            dto: {
              limit: 20,
              skipFirstNumberOfProducts: 3,
            },
          });

          // Assert: Returns exactly 20 products
          expect(result).toHaveLength(20);

          // Assert: Skipped the 3 latest products (Product 25, 24, 23)
          // Should start with Product 22 (4th latest)
          expect(result[0].products.title).toBe("Product 22");
          expect(result[1].products.title).toBe("Product 21");
          expect(result[2].products.title).toBe("Product 20");

          // Assert: Ends with Product 3 (23rd latest, since we have 25 total, skip 3, take 20 = positions 4-23)
          expect(result[19].products.title).toBe("Product 3");

          // Assert: Does NOT contain the 3 skipped products
          const titles = result.map((item) => item.products.title);
          expect(titles).not.toContain("Product 25");
          expect(titles).not.toContain("Product 24");
          expect(titles).not.toContain("Product 23");
        });
      });
    });
  });

  describe("Integration Tests - Route Handler", () => {
    describe("GET /api/main-page", () => {
      it("should return latest products with proper response format when authenticated", async () => {
        // Arrange: Mock successful authentication
        mockValidateServerSession.mockResolvedValue({ id: "user-123" });

        // Create test data in database
        const db = createTestDb();
        try {
          // Create category first (required for foreign key constraint)
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: `Test Category ${faker.string.uuid()}`,
              id: categoryId,
            },
          });

          await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          // Act: Make GET request to main-page endpoint
          const response = await GET(
            new NextRequest("http://localhost:3000/api/main-page"),
          );
          const result = (await response.json()) as MainPageResponse;

          // Assert: Response status is 200
          expect(response.status).toBe(200);

          // Assert: Response has correct structure
          expect(result.success).toBe(true);
          expect(Array.isArray(result.data)).toBe(true);
          expect(result.data).toHaveLength(1);
          expect(result.data[0].products.title).toBe("Test Product");
        } finally {
          // Clean up
          await dbHelpers.truncateProductTables(db);
        }
      });

      it("should return 401 when user is not authenticated", async () => {
        // Arrange: Mock authentication failure
        mockValidateServerSession.mockRejectedValue(new UnauthorizedError());

        // Act: Make GET request to main-page endpoint
        const response = await GET(
          new NextRequest("http://localhost:3000/api/main-page"),
        );
        const result = await response.json();

        // Assert: Response status is 401
        expect(response.status).toBe(401);
        expect(result.message).toBe("User is not authenticated.");
      });
    });
  });
});
