import { describe, it, expect, beforeEach, beforeAll, afterAll, vi, afterEach } from "vitest";
import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";
import { GET, POST } from "./route";
import { reviewService } from "./service";
import {
  createTestableUnit,
  dbHelpers,
} from "@/test/utils/db-helper";
import {
  createProductFixture,
} from "@/test/fixtures/products";
import { createProfileFixture } from "@/test/fixtures/profiles";
import type { ReviewsResponse, CreateReviewResponse } from "./types";
import {
  mockAuthenticatedApiUser,
  mockUnauthenticatedApiUser,
} from "@/test/setup/test-setup";

/**
 * Comprehensive test suite for the review API endpoint.
 * Tests cover service layer, route handlers, edge cases, and error handling.
 */
describe("/api/review", () => {
  beforeAll(async () => {
    await dbHelpers.truncateReviewTables();
  });

  afterAll(async () => {
    await dbHelpers.truncateReviewTables();
  });

  beforeEach(async () => {
    // Ensure clean state before each test
    await dbHelpers.truncateReviewTables();
  });

  describe("ReviewService - Unit Tests", () => {
    describe("getReviews", () => {
      it("returns paginated reviews with default parameters", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product" },
          });

          const user1 = await createProfileFixture({
            db,
            overrides: { email: "user1@example.com" },
          });

          const user2 = await createProfileFixture({
            db,
            overrides: { email: "user2@example.com" },
          });

          // Create reviews
          await reviewService.createReview({
            dto: {
              productId: product.id,
              content: "Great product!",
              rating: 5.0,
            },
            userId: user1.id,
            db,
          });

          await reviewService.createReview({
            dto: {
              productId: product.id,
              content: "Good product!",
              rating: 4.0,
            },
            userId: user2.id,
            db,
          });

          // Act: Get reviews with default params
          const result = await reviewService.getReviews({
            dto: {
              page: 1,
              limit: 10,
              productId: product.id,
            },
            db,
          });

          // Assert
          expect(result.reviews).toHaveLength(2);
          expect(result.pagination.currentPage).toBe(1);
          expect(result.pagination.totalPages).toBe(1);
          expect(result.pagination.totalItems).toBe(2);
          expect(result.pagination.hasNextPage).toBe(false);
          expect(result.pagination.hasPreviousPage).toBe(false);

          // Reviews should be ordered by created date (newest first)
          expect(result.reviews[0].content).toBe("Good product!");
          expect(result.reviews[1].content).toBe("Great product!");
        });
      });

      it("returns empty result when no reviews exist", async () => {
        await createTestableUnit(async (db) => {
          // Act: Get reviews when none exist
          const result = await reviewService.getReviews({
            dto: {
              page: 1,
              limit: 10,
              productId: faker.string.uuid(),
            },
            db,
          });

          // Assert
          expect(result.reviews).toHaveLength(0);
          expect(result.pagination.totalItems).toBe(0);
          expect(result.pagination.totalPages).toBe(0);
        });
      });

      it("filters reviews by product ID", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const product1 = await createProductFixture({
            db,
            overrides: { title: "Product 1" },
          });

          const product2 = await createProductFixture({
            db,
            overrides: { title: "Product 2" },
          });

          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          // Create reviews for different products
          await reviewService.createReview({
            dto: {
              productId: product1.id,
              content: "Review for product 1",
              rating: 5.0,
            },
            userId: user.id,
            db,
          });

          await reviewService.createReview({
            dto: {
              productId: product2.id,
              content: "Review for product 2",
              rating: 4.0,
            },
            userId: user.id,
            db,
          });

          // Act: Get reviews filtered by product1
          const result = await reviewService.getReviews({
            dto: {
              page: 1,
              limit: 10,
              productId: product1.id,
            },
            db,
          });

          // Assert
          expect(result.reviews).toHaveLength(1);
          expect(result.reviews[0].content).toBe("Review for product 1");
          expect(result.reviews[0].productId).toBe(product1.id);
        });
      });

      it("paginates results correctly", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product" },
          });

          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          // Create 5 reviews
          for (let i = 1; i <= 5; i++) {
            await reviewService.createReview({
              dto: {
                productId: product.id,
                content: `Review ${i}`,
                rating: 5.0,
              },
              userId: user.id,
              db,
            });
          }

          // Act: Get first page with limit 2
          const result = await reviewService.getReviews({
            dto: {
              page: 1,
              limit: 2,
              productId: product.id,
            },
            db,
          });

          // Assert
          expect(result.reviews).toHaveLength(2);
          expect(result.pagination.currentPage).toBe(1);
          expect(result.pagination.totalPages).toBe(3);
          expect(result.pagination.totalItems).toBe(5);
          expect(result.pagination.hasNextPage).toBe(true);
          expect(result.pagination.hasPreviousPage).toBe(false);
        });
      });
    });

    describe("createReview", () => {
      it("creates a review successfully", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product" },
          });

          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          // Act: Create review
          const result = await reviewService.createReview({
            dto: {
              productId: product.id,
              content: "Great product!",
              rating: 4.5,
            },
            userId: user.id,
            db,
          });

          // Assert
          expect(result.id).toBeDefined();
          expect(result.productId).toBe(product.id);
          expect(result.userId).toBe(user.id);
          expect(result.content).toBe("Great product!");
          expect(result.rating).toBe(4.5);
          expect(result.embeddingStatus).toBe("pending");
        });
      });

      it("throws error when product does not exist", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create user but not product
          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          // Act & Assert: Try to create review for non-existent product
          await expect(
            reviewService.createReview({
              dto: {
                productId: faker.string.uuid(),
                content: "Great product!",
                rating: 4.5,
              },
              userId: user.id,
              db,
            })
          ).rejects.toThrow();
        });
      });

      it("throws error when user does not exist", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create product but not user
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product" },
          });

          // Act & Assert: Try to create review for non-existent user
          await expect(
            reviewService.createReview({
              dto: {
                productId: product.id,
                content: "Great product!",
                rating: 4.5,
              },
              userId: faker.string.uuid(),
              db,
            })
          ).rejects.toThrow();
        });
      });
    });
  });

  describe("Route Handler - Integration Tests", () => {
    afterEach(() => {
      vi.clearAllMocks();
    });
    describe("GET /api/review", () => {
      it("returns paginated reviews", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product" },
          });

          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          await reviewService.createReview({
            dto: {
              productId: product.id,
              content: "Great product!",
              rating: 5.0,
            },
            userId: user.id,
            db,
          });

          // Act: Call GET endpoint
          const request = new NextRequest("http://localhost:3000/api/review");
          const response = await GET(request);
          const data = (await response.json()) as ReviewsResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.reviews).toHaveLength(1);
          expect(data.data.pagination.totalItems).toBe(1);
        });
      });

      it("filters reviews by product ID", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const product1 = await createProductFixture({
            db,
            overrides: { title: "Product 1" },
          });

          const product2 = await createProductFixture({
            db,
            overrides: { title: "Product 2" },
          });

          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          await reviewService.createReview({
            dto: {
              productId: product1.id,
              content: "Review for product 1",
              rating: 5.0,
            },
            userId: user.id,
            db,
          });

          await reviewService.createReview({
            dto: {
              productId: product2.id,
              content: "Review for product 2",
              rating: 4.0,
            },
            userId: user.id,
            db,
          });

          // Act: Call GET endpoint with productId filter
          const request = new NextRequest(
            `http://localhost:3000/api/review?productId=${product1.id}`
          );
          const response = await GET(request);
          const data = (await response.json()) as ReviewsResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.reviews).toHaveLength(1);
          expect(data.data.reviews[0].productId).toBe(product1.id);
        });
      });

      it("handles pagination parameters", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product" },
          });

          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          // Create multiple reviews
          for (let i = 1; i <= 5; i++) {
            await reviewService.createReview({
              dto: {
                productId: product.id,
                content: `Review ${i}`,
                rating: 5.0,
              },
              userId: user.id,
              db,
            });
          }

          // Act: Call GET endpoint with pagination
          const request = new NextRequest(
            "http://localhost:3000/api/review?page=1&limit=2"
          );
          const response = await GET(request);
          const data = (await response.json()) as ReviewsResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(data.success).toBe(true);
          expect(data.data.reviews).toHaveLength(2);
          expect(data.data.pagination.currentPage).toBe(1);
          expect(data.data.pagination.totalPages).toBe(3);
          expect(data.data.pagination.hasNextPage).toBe(true);
        });
      });
    });

    describe("POST /api/review", () => {
      it("creates a review successfully", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create test data and mock session
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product" },
          });

          const user = await createProfileFixture({
            db,
            overrides: { email: "user@example.com" },
          });

          // Mock authenticated user
          mockAuthenticatedApiUser({ id: user.id });

          // Act: Call POST endpoint
          const request = new NextRequest("http://localhost:3000/api/review", {
            method: "POST",
            body: JSON.stringify({
              productId: product.id,
              content: "Great product!",
              rating: 4.5,
            }),
          });
          const response = await POST(request);
          const data = (await response.json()) as CreateReviewResponse;

          // Assert
          expect(response.status).toBe(201);
          expect(data.success).toBe(true);
          expect(data.data.productId).toBe(product.id);
          expect(data.data.content).toBe("Great product!");
          expect(data.data.rating).toBe(4.5);
        });
      });

      it("returns 401 when user is not authenticated", async () => {
        // Mock unauthenticated user
        mockUnauthenticatedApiUser();

        // Act: Call POST endpoint without authentication
        const request = new NextRequest("http://localhost:3000/api/review", {
          method: "POST",
          body: JSON.stringify({
            productId: faker.string.uuid(),
            content: "Great product!",
            rating: 4.5,
          }),
        });
        const response = await POST(request);
        const data = await response.json();

        // Assert
        expect(response.status).toBe(401);
        expect(data.message).toBe("User is not authenticated.");
      });

      it("validates request body", async () => {
        await createTestableUnit(async (db) => {
          // Mock authenticated session
          mockAuthenticatedApiUser({ id: faker.string.uuid() });

          // Act: Call POST endpoint with invalid data
          const request = new NextRequest("http://localhost:3000/api/review", {
            method: "POST",
            body: JSON.stringify({
              productId: "invalid-uuid",
              content: "", // Invalid: too short
              rating: 6.0, // Invalid: too high
            }),
          });
          const response = await POST(request);

          // Assert
          expect(response.status).toBe(400);
        });
      });
    });
  });
});
