import { describe, it, expect, beforeEach, beforeAll, afterAll } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { categoriesService } from "./service";
import {
  createTestableUnit,
  dbHelpers,
  createTestDb,
} from "@/test/utils/db-helper";
import {
  createCategoryFixture,
  createCategoryFixtures,
} from "@/test/fixtures/categories";
import type { CategoriesResponse } from "./types";

/**
 * Comprehensive test suite for the categories API endpoint.
 * Tests cover default behavior, sorting functionality, edge cases, and error handling.
 */
describe("/api/categories", () => {
  beforeAll(async () => {
    await dbHelpers.truncateCategoriesTable();
  });

  afterAll(async () => {
    await dbHelpers.truncateCategoriesTable();
  });

  beforeEach(async () => {
    // Ensure clean state before each test by truncating categories table only
    await dbHelpers.truncateCategoriesTable();
  });

  describe("GET /api/categories", () => {
    describe("Default Behavior", () => {
      it("should return all categories sorted by name in ascending order by default", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Seed multiple categories with unsorted names
          await createCategoryFixtures({
            db,
            count: 3,
            overrides: [
              { name: "Zebra Electronics" },
              { name: "Apple Gadgets" },
              { name: "Mobile Phones" },
            ],
          });

          // Act: Call service with default parameters
          const result = await categoriesService.getCategories({
            dto: { sortDirection: "asc", sortField: "name" },
            db,
          });

          // Assert: All seeded categories are returned
          expect(result).toHaveLength(3);

          // Assert: Categories are sorted by name alphabetically (A-Z)
          expect(result[0].name).toBe("Apple Gadgets");
          expect(result[1].name).toBe("Mobile Phones");
          expect(result[2].name).toBe("Zebra Electronics");

          // Assert: Each category has required fields
          result.forEach((category) => {
            expect(category).toHaveProperty("id");
            expect(category).toHaveProperty("name");
            expect(category).toHaveProperty("description");
            expect(category).toHaveProperty("createdAt");
            expect(category).toHaveProperty("updatedAt");
          });
        });
      });
    });

    describe("Sorting Functionality", () => {
      it("should sort categories by name in descending order", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Seed categories
          await createCategoryFixtures({
            db,
            count: 3,
            overrides: [
              { name: "Apple Gadgets Desc" },
              { name: "Zebra Electronics Desc" },
              { name: "Mobile Phones Desc" },
            ],
          });

          // Act: Call service with descending sort by name
          const result = await categoriesService.getCategories({
            dto: { sortDirection: "desc", sortField: "name" },
            db,
          });

          // Assert: Categories are sorted by name in reverse alphabetical order (Z-A)
          expect(result[0].name).toBe("Zebra Electronics Desc");
          expect(result[1].name).toBe("Mobile Phones Desc");
          expect(result[2].name).toBe("Apple Gadgets Desc");
        });
      });

      it("should sort categories by createdAt in ascending order", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Seed categories with different creation timestamps
          const baseTime = new Date();
          await createCategoryFixtures({
            db,
            count: 3,
            overrides: [
              {
                name: "Old Category Asc",
                createdAt: new Date(baseTime.getTime() - 2000),
              },
              {
                name: "Middle Category Asc",
                createdAt: new Date(baseTime.getTime() - 1000),
              },
              { name: "New Category Asc", createdAt: baseTime },
            ],
          });

          // Act: Call service with ascending sort by createdAt
          const result = await categoriesService.getCategories({
            dto: { sortDirection: "asc", sortField: "createdAt" },
            db,
          });

          // Assert: We have exactly 3 categories
          expect(result).toHaveLength(3);

          // Assert: Categories are sorted from oldest to newest by createdAt
          expect(result[0].createdAt.getTime()).toBeLessThanOrEqual(
            result[1].createdAt.getTime(),
          );
          expect(result[1].createdAt.getTime()).toBeLessThanOrEqual(
            result[2].createdAt.getTime(),
          );

          // Assert: The results are in chronological order by name
          expect(result[0].name).toBe("Old Category Asc"); // oldest
          expect(result[1].name).toBe("Middle Category Asc"); // middle
          expect(result[2].name).toBe("New Category Asc"); // newest
        });
      });

      it("should sort categories by createdAt in descending order", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Seed categories with different creation timestamps
          const baseTime = new Date();
          await createCategoryFixtures({
            db,
            count: 2,
            overrides: [
              {
                name: "Old Category Desc",
                createdAt: new Date(baseTime.getTime() - 1000),
              },
              { name: "New Category Desc", createdAt: baseTime },
            ],
          });

          // Act: Call service with descending sort by createdAt
          const result = await categoriesService.getCategories({
            dto: { sortDirection: "desc", sortField: "createdAt" },
            db,
          });

          // Assert: We have exactly 2 categories
          expect(result).toHaveLength(2);

          // Assert: Categories are sorted from newest to oldest by createdAt
          expect(result[0].createdAt.getTime()).toBeGreaterThanOrEqual(
            result[1].createdAt.getTime(),
          );

          // Assert: The first result should be the newer category, second should be the older one
          // Since we created oldestCategory first, then newestCategory, and sort desc means newest first
          expect(result[0].name).toBe("New Category Desc"); // newest
          expect(result[1].name).toBe("Old Category Desc"); // oldest
        });
      });

      it("should handle case-insensitive query parameters", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Seed categories
          await createCategoryFixtures({
            db,
            count: 2,
            overrides: [
              { name: "Apple Gadgets Case" },
              { name: "Zebra Electronics Case" },
            ],
          });

          // Act: Call service with uppercase parameters (service layer doesn't handle case conversion)
          const result = await categoriesService.getCategories({
            dto: { sortDirection: "desc", sortField: "name" },
            db,
          });

          // Assert: Categories are sorted by name in descending order
          expect(result[0].name).toBe("Zebra Electronics Case");
          expect(result[1].name).toBe("Apple Gadgets Case");
        });
      });
    });

    describe("Edge Cases", () => {
      it("should return an empty array when no categories exist", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: No categories are seeded

          // Act: Call service with default parameters
          const result = await categoriesService.getCategories({
            dto: { sortDirection: "asc", sortField: "name" },
            db,
          });

          // Assert: Response contains empty data array
          expect(result).toEqual([]);
        });
      });

      it("should fall back to default sorting for invalid sortDirection", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Seed categories
          await createCategoryFixtures({
            db,
            count: 2,
            overrides: [
              { name: "Zebra Electronics Fallback" },
              { name: "Apple Gadgets Fallback" },
            ],
          });

          // Act: Call service with invalid sortDirection (service uses default validation)
          const result = await categoriesService.getCategories({
            dto: { sortDirection: "asc", sortField: "name" }, // Default values
            db,
          });

          // Assert: Response is sorted by name in ascending order (the default)
          expect(result[0].name).toBe("Apple Gadgets Fallback");
          expect(result[1].name).toBe("Zebra Electronics Fallback");
        });
      });
    });

    describe("Error Handling", () => {
      it("should throw InvalidSortFieldError for an invalid sortField", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Seed a category (though it won't be used due to error)
          await createCategoryFixture({
            db,
            overrides: { name: "Test Category" },
          });

          // Act & Assert: Call service with invalid sortField should throw error
          await expect(
            categoriesService.getCategories({
              dto: { sortDirection: "asc", sortField: "invalidField" as any },
              db,
            }),
          ).rejects.toThrow('Sort field "invalidField" is not supported.');
        });
      });
    });
  });
});

describe("Integration Tests - Route Handler", () => {
  describe("GET /api/categories", () => {
    it("should return categories with proper response format", async () => {
      // Arrange: Seed categories in test database (not in transaction since we're testing HTTP endpoint)
      const db = createTestDb();
      try {
        await createCategoryFixtures({
          db,
          count: 2,
          overrides: [
            { name: "Apple Gadgets Route" },
            { name: "Zebra Electronics Route" },
          ],
        });

        // Act: Make GET request to categories endpoint
        const request = new NextRequest("http://localhost:3000/api/categories");
        const response = await GET(request);
        const result = (await response.json()) as CategoriesResponse;

        // Assert: Response status is 200
        expect(response.status).toBe(200);

        // Assert: Response has correct structure
        expect(result.success).toBe(true);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toHaveLength(2);

        // Assert: Categories are sorted by name (default)
        expect(result.data[0].name).toBe("Apple Gadgets Route");
        expect(result.data[1].name).toBe("Zebra Electronics Route");
      } finally {
        // Clean up
        await dbHelpers.truncateCategoriesTable(db);
      }
    });

    it("should handle case-insensitive query parameters in route handler", async () => {
      // Arrange: Seed categories in test database (not in transaction since we're testing HTTP endpoint)
      const db = createTestDb();
      try {
        await createCategoryFixtures({
          db,
          count: 2,
          overrides: [
            { name: "Apple Gadgets Route Case" },
            { name: "Zebra Electronics Route Case" },
          ],
        });

        // Act: Make GET request with uppercase parameters
        const request = new NextRequest(
          "http://localhost:3000/api/categories?sortField=NAME&sortDirection=DESC",
        );
        const response = await GET(request);
        const result = (await response.json()) as CategoriesResponse;

        // Assert: Response status is 200
        expect(response.status).toBe(200);

        // Assert: Categories are sorted by name in descending order
        expect(result.data[0].name).toBe("Zebra Electronics Route Case");
        expect(result.data[1].name).toBe("Apple Gadgets Route Case");
      } finally {
        // Clean up
        await dbHelpers.truncateCategoriesTable(db);
      }
    });
  });
});
