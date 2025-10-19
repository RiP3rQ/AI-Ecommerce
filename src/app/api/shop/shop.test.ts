import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { shopService } from "./service";
import {
  createTestableUnit,
  dbHelpers,
  createTestDb,
} from "@/test/utils/db-helper";
import {
  createProductFixture,
  createProductVariantFixture,
} from "@/test/fixtures/products";
import { createCategoryFixture } from "@/test/fixtures/categories";
import { productImages } from "@/database/schemas/product-images";
import type { ShopProductsResponse } from "./types";

/**
 * Comprehensive test suite for the shop API endpoint.
 * Tests cover service layer, route handlers, edge cases, and error handling.
 */
describe("/api/shop", () => {
  beforeAll(async () => {
    await dbHelpers.truncateProductTables();
  });

  afterAll(async () => {
    await dbHelpers.truncateProductTables();
  });

  beforeEach(async () => {
    // Ensure clean state before each test
    await dbHelpers.truncateProductTables();
  });

  describe("ShopService - Unit Tests", () => {
    describe("getProducts", () => {
      it("returns paginated products with default parameters", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: `Test Category ${faker.string.uuid()}`,
              id: categoryId,
            },
          });

          // Create multiple products
          const products = await Promise.all([
            createProductFixture({
              db,
              overrides: { title: "Product 1", categoryId },
            }),
            createProductFixture({
              db,
              overrides: { title: "Product 2", categoryId },
            }),
            createProductFixture({
              db,
              overrides: { title: "Product 3", categoryId },
            }),
          ]);

          // Create variants for each product
          for (const product of products) {
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: faker.number.int({ min: 1000, max: 10000 }),
                currencyCode: "USD",
              },
            });
          }

          // Act: Get products with default params
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(3);
          expect(result.pagination.currentPage).toBe(1);
          expect(result.pagination.totalPages).toBe(1);
          expect(result.pagination.totalItems).toBe(3);
          expect(result.pagination.hasNextPage).toBe(false);
          expect(result.pagination.hasPreviousPage).toBe(false);
        });
      });

      it("returns empty result when no products exist", async () => {
        await createTestableUnit(async (db) => {
          // Act: Get products from empty database
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(0);
          expect(result.pagination.totalItems).toBe(0);
          expect(result.pagination.totalPages).toBe(0);
        });
      });

      it("filters products by search term in title", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
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
            overrides: { title: "Apple iPhone", categoryId },
          });
          await createProductFixture({
            db,
            overrides: { title: "Samsung Galaxy", categoryId },
          });
          await createProductFixture({
            db,
            overrides: { title: "Google Pixel", categoryId },
          });

          // Add variants
          const products = await db.query.products.findMany();
          for (const product of products) {
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          // Act: Search for "Apple"
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
              search: "Apple",
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(1);
          expect(result.products[0].title).toBe("Apple iPhone");
          expect(result.pagination.totalItems).toBe(1);
        });
      });

      it("filters products by search term in description", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
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
            overrides: {
              title: "Product 1",
              description: "This is a premium laptop",
              categoryId,
            },
          });
          await createProductFixture({
            db,
            overrides: {
              title: "Product 2",
              description: "This is a gaming mouse",
              categoryId,
            },
          });

          // Add variants
          const products = await db.query.products.findMany();
          for (const product of products) {
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          // Act: Search for "premium"
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
              search: "premium",
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(1);
          expect(result.products[0].description).toContain("premium");
        });
      });

      it("filters products by category", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const category1Id = faker.string.uuid();
          const category2Id = faker.string.uuid();

          const category1 = await createCategoryFixture({
            db,
            overrides: {
              name: "Electronics",
              id: category1Id,
            },
          });

          const category2 = await createCategoryFixture({
            db,
            overrides: {
              name: "Clothing",
              id: category2Id,
            },
          });

          // Create products in different categories
          await createProductFixture({
            db,
            overrides: { title: "Laptop", categoryId: category1Id },
          });
          await createProductFixture({
            db,
            overrides: { title: "T-Shirt", categoryId: category2Id },
          });

          // Add variants
          const products = await db.query.products.findMany();
          for (const product of products) {
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          // Act: Filter by Electronics category
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
              categoryId: category1Id,
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(1);
          expect(result.products[0].title).toBe("Laptop");
          expect(result.products[0].category?.name).toBe("Electronics");
        });
      });

      it("filters products by availability", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
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
            overrides: {
              title: "Available Product",
              availableForSale: true,
              categoryId,
            },
          });
          await createProductFixture({
            db,
            overrides: {
              title: "Unavailable Product",
              availableForSale: false,
              categoryId,
            },
          });

          // Add variants
          const products = await db.query.products.findMany();
          for (const product of products) {
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          // Act: Filter by available products only
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
              availableForSale: true,
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(1);
          expect(result.products[0].title).toBe("Available Product");
          expect(result.products[0].availableForSale).toBe(true);
        });
      });

      it("filters products by price range", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: `Test Category ${faker.string.uuid()}`,
              id: categoryId,
            },
          });

          // Create products with different price ranges
          const product1 = await createProductFixture({
            db,
            overrides: { title: "Cheap Product", categoryId },
          });
          const product2 = await createProductFixture({
            db,
            overrides: { title: "Medium Product", categoryId },
          });
          const product3 = await createProductFixture({
            db,
            overrides: { title: "Expensive Product", categoryId },
          });

          // Create variants with different prices
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product1.id,
              price: 500, // $5.00
              currencyCode: "USD",
            },
          });
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product2.id,
              price: 1500, // $15.00
              currencyCode: "USD",
            },
          });
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product3.id,
              price: 3000, // $30.00
              currencyCode: "USD",
            },
          });

          // Act: Filter by price range $10 - $25
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
              priceMin: 1000, // $10.00
              priceMax: 2500, // $25.00
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(1);
          expect(result.products[0].title).toBe("Medium Product");
          expect(result.products[0].minPrice).toBe(1500);
        });
      });

      it("sorts products by title ascending", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
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
            overrides: { title: "Z Product", categoryId },
          });
          await createProductFixture({
            db,
            overrides: { title: "A Product", categoryId },
          });
          await createProductFixture({
            db,
            overrides: { title: "M Product", categoryId },
          });

          // Add variants
          const products = await db.query.products.findMany();
          for (const product of products) {
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          // Act: Sort by title ascending
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "title",
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(3);
          expect(result.products[0].title).toBe("A Product");
          expect(result.products[1].title).toBe("M Product");
          expect(result.products[2].title).toBe("Z Product");
        });
      });

      it("sorts products by title descending", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
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
            overrides: { title: "Z Product", categoryId },
          });
          await createProductFixture({
            db,
            overrides: { title: "A Product", categoryId },
          });

          // Add variants
          const products = await db.query.products.findMany();
          for (const product of products) {
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          // Act: Sort by title descending
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "desc",
              sortField: "title",
            },
            db,
          });

          // Assert
          expect(result.products[0].title).toBe("Z Product");
          expect(result.products[1].title).toBe("A Product");
        });
      });

      it("paginates results correctly", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create 5 products
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: `Test Category ${faker.string.uuid()}`,
              id: categoryId,
            },
          });

          for (let i = 1; i <= 5; i++) {
            const product = await createProductFixture({
              db,
              overrides: { title: `Product ${i}`, categoryId },
            });
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          // Act: Get page 1 with limit 2
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 2,
              sortDirection: "asc",
              sortField: "createdAt",
            },
            db,
          });

          // Assert: Page 1
          expect(result.products).toHaveLength(2);
          expect(result.pagination.currentPage).toBe(1);
          expect(result.pagination.totalPages).toBe(3);
          expect(result.pagination.totalItems).toBe(5);
          expect(result.pagination.hasNextPage).toBe(true);
          expect(result.pagination.hasPreviousPage).toBe(false);

          // Act: Get page 2
          const result2 = await shopService.getProducts({
            dto: {
              page: 2,
              limit: 2,
              sortDirection: "asc",
              sortField: "createdAt",
            },
            db,
          });

          // Assert: Page 2
          expect(result2.products).toHaveLength(2);
          expect(result2.pagination.currentPage).toBe(2);
          expect(result2.pagination.hasNextPage).toBe(true);
          expect(result2.pagination.hasPreviousPage).toBe(true);

          // Act: Get page 3
          const result3 = await shopService.getProducts({
            dto: {
              page: 3,
              limit: 2,
              sortDirection: "asc",
              sortField: "createdAt",
            },
            db,
          });

          // Assert: Page 3 (last page)
          expect(result3.products).toHaveLength(1);
          expect(result3.pagination.currentPage).toBe(3);
          expect(result3.pagination.hasNextPage).toBe(false);
          expect(result3.pagination.hasPreviousPage).toBe(true);
        });
      });

      it("throws InvalidPriceRangeError when priceMin > priceMax", async () => {
        await createTestableUnit(async (db) => {
          // Act & Assert
          await expect(
            shopService.getProducts({
              dto: {
                page: 1,
                limit: 10,
                sortDirection: "asc",
                sortField: "createdAt",
                priceMin: 2000,
                priceMax: 1000, // Invalid: min > max
              },
              db,
            })
          ).rejects.toThrow(
            "Invalid price range. Minimum price must be less than maximum price."
          );
        });
      });

      it("throws CategoryNotFoundError when filtering by non-existent category", async () => {
        await createTestableUnit(async (db) => {
          // Act & Assert
          await expect(
            shopService.getProducts({
              dto: {
                page: 1,
                limit: 10,
                sortDirection: "asc",
                sortField: "createdAt",
                categoryId: "non-existent-category-id",
              },
              db,
            })
          ).rejects.toThrow(
            'Category with id "non-existent-category-id" does not exist.'
          );
        });
      });

      it("throws InvalidSortFieldError for invalid sort field", async () => {
        await createTestableUnit(async (db) => {
          // Act & Assert
          await expect(
            shopService.getProducts({
              dto: {
                page: 1,
                limit: 10,
                sortDirection: "asc",
                sortField: "invalidField" as any,
              },
              db,
            })
          ).rejects.toThrow('Sort field "invalidField" is not supported.');
        });
      });

      it("returns products with correct computed fields", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product with multiple variants and images
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: "Electronics",
              id: categoryId,
            },
          });

          const product = await createProductFixture({
            db,
            overrides: {
              title: "Test Product",
              description: "Test description",
              categoryId,
            },
          });

          // Create multiple variants with different prices
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 2000,
              currencyCode: "USD",
            },
          });

          // Create product images
          await db.insert(productImages).values([
            {
              id: faker.string.uuid(),
              productId: product.id,
              url: "https://example.com/image1.jpg",
              altText: "Image 1",
              order: 1,
              width: 800,
              height: 600,
            },
            {
              id: faker.string.uuid(),
              productId: product.id,
              url: "https://example.com/image2.jpg",
              altText: "Image 2",
              order: 0, // Featured image
              width: 800,
              height: 600,
            },
          ]);

          // Act
          const result = await shopService.getProducts({
            dto: {
              page: 1,
              limit: 10,
              sortDirection: "asc",
              sortField: "createdAt",
            },
            db,
          });

          // Assert
          expect(result.products).toHaveLength(1);
          const productWithDetails = result.products[0];

          // Check computed fields
          expect(productWithDetails.minPrice).toBe(1000);
          expect(productWithDetails.maxPrice).toBe(2000);
          expect(productWithDetails.currencyCode).toBe("USD");
          expect(productWithDetails.variantCount).toBe(2);
          expect(productWithDetails.category?.name).toBe("Electronics");
          expect(productWithDetails.featuredImage?.url).toBe(
            "https://example.com/image2.jpg"
          );
        });
      });
    });
  });

  describe("Integration Tests - Route Handler", () => {
    it("returns 200 with products for valid request", async () => {
      // Arrange: Seed data in test database
      const db = createTestDb();
      try {
        const categoryId = faker.string.uuid();
        const category = await createCategoryFixture({
          db,
          overrides: {
            name: `Test Category ${faker.string.uuid()}`,
            id: categoryId,
          },
        });

        const product = await createProductFixture({
          db,
          overrides: { title: "Test Product", categoryId },
        });

        await createProductVariantFixture({
          db,
          overrides: {
            productId: product.id,
            price: 1500,
            currencyCode: "USD",
          },
        });

        const request = new NextRequest("http://localhost:3000/api/shop");

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.data.products).toHaveLength(1);
        expect(result.data.products[0].title).toBe("Test Product");
        expect(result.data.pagination.totalItems).toBe(1);
      } finally {
        // Clean up
        await dbHelpers.truncateProductTables(db);
      }
    });

    it("handles search query parameter", async () => {
      // Arrange: Seed data
      const db = createTestDb();
      try {
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
          overrides: { title: "Apple iPhone", categoryId },
        });
        await createProductFixture({
          db,
          overrides: { title: "Samsung Galaxy", categoryId },
        });

        // Add variants
        const products = await db.query.products.findMany();
        for (const product of products) {
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });
        }

        const request = new NextRequest(
          "http://localhost:3000/api/shop?search=Apple"
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.data.products).toHaveLength(1);
        expect(result.data.products[0].title).toBe("Apple iPhone");
      } finally {
        await dbHelpers.truncateProductTables(db);
      }
    });

    it("handles category filtering", async () => {
      // Arrange: Seed data
      const db = createTestDb();
      try {
        const category1Id = faker.string.uuid();
        const category2Id = faker.string.uuid();

        await createCategoryFixture({
          db,
          overrides: { name: "Electronics", id: category1Id },
        });
        await createCategoryFixture({
          db,
          overrides: { name: "Clothing", id: category2Id },
        });

        const product1 = await createProductFixture({
          db,
          overrides: { title: "Laptop", categoryId: category1Id },
        });
        const product2 = await createProductFixture({
          db,
          overrides: { title: "T-Shirt", categoryId: category2Id },
        });

        await createProductVariantFixture({
          db,
          overrides: {
            productId: product1.id,
            price: 1000,
            currencyCode: "USD",
          },
        });
        await createProductVariantFixture({
          db,
          overrides: {
            productId: product2.id,
            price: 1000,
            currencyCode: "USD",
          },
        });

        const request = new NextRequest(
          `http://localhost:3000/api/shop?categoryId=${category1Id}`
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.data.products).toHaveLength(1);
        expect(result.data.products[0].title).toBe("Laptop");
      } finally {
        await dbHelpers.truncateProductTables(db);
      }
    });

    it("handles price range filtering", async () => {
      // Arrange: Seed data
      const db = createTestDb();
      try {
        const categoryId = faker.string.uuid();
        const category = await createCategoryFixture({
          db,
          overrides: {
            name: `Test Category ${faker.string.uuid()}`,
            id: categoryId,
          },
        });

        const product1 = await createProductFixture({
          db,
          overrides: { title: "Cheap Product", categoryId },
        });
        const product2 = await createProductFixture({
          db,
          overrides: { title: "Medium Product", categoryId },
        });

        await createProductVariantFixture({
          db,
          overrides: {
            productId: product1.id,
            price: 500,
            currencyCode: "USD",
          },
        });
        await createProductVariantFixture({
          db,
          overrides: {
            productId: product2.id,
            price: 1500,
            currencyCode: "USD",
          },
        });

        const request = new NextRequest(
          "http://localhost:3000/api/shop?priceMin=1000&priceMax=2000"
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.data.products).toHaveLength(1);
        expect(result.data.products[0].title).toBe("Medium Product");
      } finally {
        await dbHelpers.truncateProductTables(db);
      }
    });

    it("handles pagination parameters", async () => {
      // Arrange: Seed data
      const db = createTestDb();
      try {
        const categoryId = faker.string.uuid();
        const category = await createCategoryFixture({
          db,
          overrides: {
            name: `Test Category ${faker.string.uuid()}`,
            id: categoryId,
          },
        });

        // Create 3 products
        for (let i = 1; i <= 3; i++) {
          const product = await createProductFixture({
            db,
            overrides: { title: `Product ${i}`, categoryId },
          });
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });
        }

        const request = new NextRequest(
          "http://localhost:3000/api/shop?page=1&limit=2"
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.data.products).toHaveLength(2);
        expect(result.data.pagination.currentPage).toBe(1);
        expect(result.data.pagination.totalPages).toBe(2);
        expect(result.data.pagination.totalItems).toBe(3);
      } finally {
        await dbHelpers.truncateProductTables(db);
      }
    });

    it("handles sorting parameters", async () => {
      // Arrange: Seed data
      const db = createTestDb();
      try {
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
          overrides: { title: "Z Product", categoryId },
        });
        await createProductFixture({
          db,
          overrides: { title: "A Product", categoryId },
        });

        // Add variants
        const products = await db.query.products.findMany();
        for (const product of products) {
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });
        }

        const request = new NextRequest(
          "http://localhost:3000/api/shop?sortField=title&sortDirection=asc"
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.data.products[0].title).toBe("A Product");
        expect(result.data.products[1].title).toBe("Z Product");
      } finally {
        await dbHelpers.truncateProductTables(db);
      }
    });

    it("handles availability filtering", async () => {
      // Arrange: Seed data
      const db = createTestDb();
      try {
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
          overrides: {
            title: "Available Product",
            availableForSale: true,
            categoryId,
          },
        });
        await createProductFixture({
          db,
          overrides: {
            title: "Unavailable Product",
            availableForSale: false,
            categoryId,
          },
        });

        // Add variants
        const products = await db.query.products.findMany();
        for (const product of products) {
          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });
        }

        const request = new NextRequest(
          "http://localhost:3000/api/shop?availableForSale=true"
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.data.products).toHaveLength(1);
        expect(result.data.products[0].title).toBe("Available Product");
      } finally {
        await dbHelpers.truncateProductTables(db);
      }
    });

    it("returns 400 for invalid price range", async () => {
      // Arrange
      const request = new NextRequest(
        "http://localhost:3000/api/shop?priceMin=2000&priceMax=1000"
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(400);
    });

    it("returns 400 for invalid pagination parameters", async () => {
      // Arrange
      const request = new NextRequest(
        "http://localhost:3000/api/shop?page=0&limit=150"
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(400);
    });

    it("returns 400 for invalid sort parameters", async () => {
      // Arrange
      const request = new NextRequest(
        "http://localhost:3000/api/shop?sortField=invalid&sortDirection=up"
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(400);
    });

    it("returns 400 for invalid category UUID", async () => {
      // Arrange
      const request = new NextRequest(
        "http://localhost:3000/api/shop?categoryId=non-existent-category"
      );

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(400);
    });

    it("handles complex query with multiple filters", async () => {
      // Arrange: Seed data
      const db = createTestDb();
      try {
        const categoryId = faker.string.uuid();
        const category = await createCategoryFixture({
          db,
          overrides: {
            name: `Complex Test Electronics ${faker.string.uuid()}`,
            id: categoryId,
          },
        });

        await createProductFixture({
          db,
          overrides: {
            title: "Apple iPhone 15",
            description: "Latest smartphone",
            availableForSale: true,
            categoryId,
          },
        });
        await createProductFixture({
          db,
          overrides: {
            title: "Samsung Galaxy",
            description: "Android phone",
            availableForSale: true,
            categoryId,
          },
        });
        await createProductFixture({
          db,
          overrides: {
            title: "Cheap Android",
            description: "Budget phone",
            availableForSale: true,
            categoryId,
          },
        });

        // Add variants with different prices
        const products = await db.query.products.findMany();
        await createProductVariantFixture({
          db,
          overrides: {
            productId: products[0].id,
            price: 2000,
            currencyCode: "USD",
          },
        });
        await createProductVariantFixture({
          db,
          overrides: {
            productId: products[1].id,
            price: 1500,
            currencyCode: "USD",
          },
        });
        await createProductVariantFixture({
          db,
          overrides: {
            productId: products[2].id,
            price: 500,
            currencyCode: "USD",
          },
        });

        const request = new NextRequest(
          "http://localhost:3000/api/shop?search=iPhone&priceMin=1500&priceMax=2500&availableForSale=true&sortField=title&sortDirection=asc&page=1&limit=10"
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.data.products).toHaveLength(1);
        expect(result.data.products[0].title).toBe("Apple iPhone 15");
      } finally {
        await dbHelpers.truncateProductTables(db);
      }
    });
  });

  describe("Edge Cases and Additional Error Handling", () => {
    describe("Empty Results", () => {
      it("returns empty results for search term that matches nothing", async () => {
        // Arrange: Seed data
        const db = createTestDb();
        try {
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
            overrides: { title: "Apple Product", categoryId },
          });

          // Add variant
          const products = await db.query.products.findMany();
          await createProductVariantFixture({
            db,
            overrides: {
              productId: products[0].id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const request = new NextRequest(
            "http://localhost:3000/api/shop?search=nonexistent"
          );

          // Act
          const response = await GET(request);
          const result = (await response.json()) as ShopProductsResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.data.products).toHaveLength(0);
          expect(result.data.pagination.totalItems).toBe(0);
        } finally {
          await dbHelpers.truncateProductTables(db);
        }
      });

      it("returns empty results when filtering by non-existent category", async () => {
        // Arrange: Seed data
        const db = createTestDb();
        try {
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

          // Add variant
          const products = await db.query.products.findMany();
          await createProductVariantFixture({
            db,
            overrides: {
              productId: products[0].id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const request = new NextRequest(
            "http://localhost:3000/api/shop?categoryId=non-existent-id"
          );

          // Act
          const response = await GET(request);

          // Assert: Should return 400 error for invalid UUID
          expect(response.status).toBe(400);
        } finally {
          await dbHelpers.truncateProductTables(db);
        }
      });
    });

    describe("Input Validation", () => {
      it("handles negative price values", async () => {
        // Arrange
        const request = new NextRequest(
          "http://localhost:3000/api/shop?priceMin=-100&priceMax=1000"
        );

        // Act
        const response = await GET(request);

        // Assert
        expect(response.status).toBe(400);
      });

      it("handles invalid limit values", async () => {
        // Arrange
        const request = new NextRequest(
          "http://localhost:3000/api/shop?limit=0"
        );

        // Act
        const response = await GET(request);

        // Assert
        expect(response.status).toBe(400);
      });

      it("handles invalid page values", async () => {
        // Arrange
        const request = new NextRequest(
          "http://localhost:3000/api/shop?page=-1"
        );

        // Act
        const response = await GET(request);

        // Assert
        expect(response.status).toBe(400);
      });
    });

    describe("Performance and Large Datasets", () => {
      it("handles large result sets with pagination", async () => {
        // Arrange: Create many products
        const db = createTestDb();
        try {
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: `Test Category ${faker.string.uuid()}`,
              id: categoryId,
            },
          });

          // Create 25 products
          for (let i = 1; i <= 25; i++) {
            const product = await createProductFixture({
              db,
              overrides: { title: `Product ${i}`, categoryId },
            });
            await createProductVariantFixture({
              db,
              overrides: {
                productId: product.id,
                price: 1000,
                currencyCode: "USD",
              },
            });
          }

          const request = new NextRequest(
            "http://localhost:3000/api/shop?page=2&limit=10"
          );

          // Act
          const response = await GET(request);
          const result = (await response.json()) as ShopProductsResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.data.products).toHaveLength(10);
          expect(result.data.pagination.currentPage).toBe(2);
          expect(result.data.pagination.totalPages).toBe(3);
          expect(result.data.pagination.totalItems).toBe(25);
        } finally {
          await dbHelpers.truncateProductTables(db);
        }
      });
    });

    describe("Data Integrity", () => {
      it("handles products without variants gracefully", async () => {
        // Arrange: Create product without variants
        const db = createTestDb();
        try {
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
            overrides: { title: "Product Without Variants", categoryId },
          });

          const request = new NextRequest("http://localhost:3000/api/shop");

          // Act
          const response = await GET(request);
          const result = (await response.json()) as ShopProductsResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.data.products).toHaveLength(1);
          expect(result.data.products[0].variantCount).toBe(0);
          expect(result.data.products[0].minPrice).toBe(0);
          expect(result.data.products[0].maxPrice).toBe(0);
        } finally {
          await dbHelpers.truncateProductTables(db);
        }
      });

      it("handles products without images gracefully", async () => {
        // Arrange: Create product without images
        const db = createTestDb();
        try {
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: `Test Category ${faker.string.uuid()}`,
              id: categoryId,
            },
          });

          const product = await createProductFixture({
            db,
            overrides: { title: "Product Without Images", categoryId },
          });

          await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const request = new NextRequest("http://localhost:3000/api/shop");

          // Act
          const response = await GET(request);
          const result = (await response.json()) as ShopProductsResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.data.products).toHaveLength(1);
          expect(result.data.products[0].featuredImage).toBeNull();
        } finally {
          await dbHelpers.truncateProductTables(db);
        }
      });
    });

    describe("Route Handler Error Scenarios", () => {
      it("handles malformed query parameters gracefully", async () => {
        // Arrange: Invalid page number
        const request = new NextRequest(
          "http://localhost:3000/api/shop?page=abc&limit=10"
        );

        // Act
        const response = await GET(request);

        // Assert
        expect(response.status).toBe(400);
      });

      it("handles missing required parameters gracefully", async () => {
        // All parameters are optional, so this should work
        const request = new NextRequest("http://localhost:3000/api/shop");

        // Act
        const response = await GET(request);

        // Assert
        expect(response.status).toBe(200);
      });

      it("handles extreme parameter values", async () => {
        // Arrange: Very large page number
        const request = new NextRequest(
          "http://localhost:3000/api/shop?page=999999&limit=10"
        );

        // Act
        const response = await GET(request);
        const result = (await response.json()) as ShopProductsResponse;

        // Assert: Should return empty results gracefully
        expect(response.status).toBe(200);
        expect(result.data.products).toHaveLength(0);
        expect(result.data.pagination.currentPage).toBe(999999);
      });
    });
  });
});
