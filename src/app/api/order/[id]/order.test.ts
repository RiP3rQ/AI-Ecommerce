import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest";
import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";
import { GET } from "./route";
import { orderService } from "./service";
import {
  createTestableUnit,
  dbHelpers,
  createTestDb,
} from "@/test/utils/db-helper";
import { createProfileFixture } from "@/test/fixtures/profiles";
import {
  createProductFixture,
  createProductVariantFixture,
} from "@/test/fixtures/products";
import { createProductImageFixture } from "@/test/fixtures/product-images";
import { createCategoryFixture } from "@/test/fixtures/categories";
import { carts, cartItems } from "@/database/schemas/cart";
import { orders, orderItems } from "@/database/schemas/orders";
import {
  mockAuthenticatedApiUser,
  mockUnauthenticatedApiUser,
} from "@/test/setup/test-setup";
import type { OrderDetailsResponse } from "./dto";
import { eq } from "drizzle-orm";

/**
 * Comprehensive test suite for the order details API endpoint.
 * Tests cover service layer, route handlers, edge cases, and error handling.
 */
describe("/api/order/[id]", () => {
  beforeAll(async () => {
    await dbHelpers.truncateCartTables();
    await dbHelpers.truncateProductTables();
    await dbHelpers.truncateOrderTables();
  });

  afterAll(async () => {
    await dbHelpers.truncateCartTables();
    await dbHelpers.truncateProductTables();
    await dbHelpers.truncateOrderTables();
  });

  beforeEach(async () => {
    // Ensure clean state before each test
    await dbHelpers.truncateCartTables();
    await dbHelpers.truncateProductTables();
    await dbHelpers.truncateOrderTables();
  });

  describe("OrderService - Unit Tests", () => {
    describe("getOrderDetails", () => {
      it("successfully retrieves order details with full product information", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, products, variants, and order with items
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: {
              name: `Test Category ${faker.string.uuid()}`,
              id: categoryId,
            },
          });

          // Create first product with variant and image
          const product1 = await createProductFixture({
            db,
            overrides: {
              title: "Order Test Product 1",
              description: "Description for product 1",
              categoryId,
            },
          });

          const variant1 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product1.id,
              title: "Variant 1",
              price: 1500,
              currencyCode: "USD",
              selectedOptions: [
                { name: "Size", value: "M" },
                { name: "Color", value: "Blue" },
              ],
            },
          });

          await createProductImageFixture({
            db,
            overrides: {
              productId: product1.id,
              url: "https://example.com/image1.jpg",
              altText: "Product 1 image",
              order: 0,
            },
          });

          // Create second product with variant and image
          const product2 = await createProductFixture({
            db,
            overrides: {
              title: "Order Test Product 2",
              description: "Description for product 2",
              categoryId,
            },
          });

          const variant2 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product2.id,
              title: "Variant 2",
              price: 750,
              currencyCode: "USD",
              selectedOptions: [
                { name: "Size", value: "L" },
                { name: "Color", value: "Red" },
              ],
            },
          });

          await createProductImageFixture({
            db,
            overrides: {
              productId: product2.id,
              url: "https://example.com/image2.jpg",
              altText: "Product 2 image",
              order: 0,
            },
          });

          // Create order and order items
          const [order] = await db
            .insert(orders)
            .values({
              userId: profile.id,
              totalPrice: 3750, // (2 * 1500) + (3 * 750)
              status: "completed",
            })
            .returning();

          await db.insert(orderItems).values([
            {
              orderId: order.id,
              productVariantId: variant1.id,
              quantity: 2,
              priceAtPurchase: 1500,
            },
            {
              orderId: order.id,
              productVariantId: variant2.id,
              quantity: 3,
              priceAtPurchase: 750,
            },
          ]);

          // Act: Get order details
          const result = await orderService.getOrderDetails({
            orderId: order.id,
            userId: profile.id,
            db,
          });

          // Assert: Order details are correct
          expect(result.id).toBe(order.id);
          expect(result.totalPrice).toBe(3750);
          expect(result.status).toBe("completed");
          expect(result.totalItems).toBe(5); // 2 + 3
          expect(result.items).toHaveLength(2);

          // Assert: First order item details
          const item1 = result.items.find(item => item.productVariant.id === variant1.id);
          expect(item1).toBeDefined();
          expect(item1!.quantity).toBe(2);
          expect(item1!.priceAtPurchase).toBe(1500);
          expect(item1!.productVariant.title).toBe("Variant 1");
          expect(item1!.productVariant.price).toBe(1500);
          expect(item1!.productVariant.product.title).toBe("Order Test Product 1");
          expect(item1!.productVariant.product.description).toBe("Description for product 1");
          expect(item1!.featuredImage?.url).toBe("https://example.com/image1.jpg");

          // Assert: Second order item details
          const item2 = result.items.find(item => item.productVariant.id === variant2.id);
          expect(item2).toBeDefined();
          expect(item2!.quantity).toBe(3);
          expect(item2!.priceAtPurchase).toBe(750);
          expect(item2!.productVariant.title).toBe("Variant 2");
          expect(item2!.productVariant.price).toBe(750);
          expect(item2!.productVariant.product.title).toBe("Order Test Product 2");
          expect(item2!.featuredImage?.url).toBe("https://example.com/image2.jpg");
        });
      });

      it("throws OrderNotFoundError when order does not exist", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          // Act & Assert: Attempt to get non-existent order
          await expect(
            orderService.getOrderDetails({
              orderId: faker.string.uuid(),
              userId: profile.id,
              db,
            }),
          ).rejects.toThrow("Order not found.");
        });
      });

      it("throws OrderNotFoundError when order belongs to different user", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create two profiles
          const profile1 = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const profile2 = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          // Create order for profile1
          const [order] = await db
            .insert(orders)
            .values({
              userId: profile1.id,
              totalPrice: 1000,
              status: "completed",
            })
            .returning();

          // Act & Assert: Attempt to access order as profile2
          await expect(
            orderService.getOrderDetails({
              orderId: order.id,
              userId: profile2.id,
              db,
            }),
          ).rejects.toThrow("Order not found.");
        });
      });

      it("returns order with no images when products have no images", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, and variant (no images)
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

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
            overrides: {
              title: "Product Without Images",
              categoryId,
            },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 500,
              currencyCode: "USD",
            },
          });

          // Create order and order item
          const [order] = await db
            .insert(orders)
            .values({
              userId: profile.id,
              totalPrice: 1000,
              status: "completed",
            })
            .returning();

          await db.insert(orderItems).values([
            {
              orderId: order.id,
              productVariantId: variant.id,
              quantity: 2,
              priceAtPurchase: 500,
            },
          ]);

          // Act: Get order details
          const result = await orderService.getOrderDetails({
            orderId: order.id,
            userId: profile.id,
            db,
          });

          // Assert: Order item has null featured image
          expect(result.items).toHaveLength(1);
          expect(result.items[0].featuredImage).toBeNull();
        });
      });
    });
  });

  describe("GET Route Handler - Integration Tests", () => {
    it("successfully returns order details for authenticated user", async () => {
      await createTestableUnit(async (db) => {
        // Arrange: Create profile, product, variant, order
        const profile = await createProfileFixture({
          db,
          overrides: { id: faker.string.uuid() },
        });

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
          overrides: {
            title: "Route Test Product",
            categoryId,
          },
        });

        const variant = await createProductVariantFixture({
          db,
          overrides: {
            productId: product.id,
            price: 2000,
            currencyCode: "USD",
          },
        });

        // Create order and order item
        const [order] = await db
          .insert(orders)
          .values({
            userId: profile.id,
            totalPrice: 4000,
            status: "completed",
          })
          .returning();

        await db.insert(orderItems).values([
          {
            orderId: order.id,
            productVariantId: variant.id,
            quantity: 2,
            priceAtPurchase: 2000,
          },
        ]);

        // Mock authenticated user
        mockAuthenticatedApiUser({ id: profile.id });

        // Create request
        const request = new NextRequest(
          `http://localhost:3000/api/order/${order.id}`,
          {
            method: "GET",
          },
        );

        // Act: Call route handler
        const response = await GET(request, {
          params: Promise.resolve({ id: order.id }),
        });
        const result = (await response.json()) as OrderDetailsResponse;

        // Assert: Response is successful
        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.data.id).toBe(order.id);
        expect(result.data.totalPrice).toBe(4000);
        expect(result.data.totalItems).toBe(2);
        expect(result.data.items).toHaveLength(1);
      });
    });

    it("returns 404 for non-existent order", async () => {
      await createTestableUnit(async (db) => {
        // Arrange: Create profile
        const profile = await createProfileFixture({
          db,
          overrides: { id: faker.string.uuid() },
        });

        // Mock authenticated user
        mockAuthenticatedApiUser({ id: profile.id });

        // Create request with non-existent order ID
        const nonExistentOrderId = faker.string.uuid();
        const request = new NextRequest(
          `http://localhost:3000/api/order/${nonExistentOrderId}`,
          {
            method: "GET",
          },
        );

        // Act: Call route handler
        const response = await GET(request, {
          params: Promise.resolve({ id: nonExistentOrderId }),
        });
        const result = await response.json();

        // Assert: Returns 404
        expect(response.status).toBe(404);
        expect(result.message).toBe("Order not found.");
      });
    });

    it("returns 404 when accessing another user's order", async () => {
      await createTestableUnit(async (db) => {
        // Arrange: Create two profiles
        const profile1 = await createProfileFixture({
          db,
          overrides: { id: faker.string.uuid() },
        });

        const profile2 = await createProfileFixture({
          db,
          overrides: { id: faker.string.uuid() },
        });

        // Create order for profile1
        const [order] = await db
          .insert(orders)
          .values({
            userId: profile1.id,
            totalPrice: 1000,
            status: "completed",
          })
          .returning();

        // Mock authenticated user as profile2
        mockAuthenticatedApiUser({ id: profile2.id });

        // Create request to access profile1's order
        const request = new NextRequest(
          `http://localhost:3000/api/order/${order.id}`,
          {
            method: "GET",
          },
        );

        // Act: Call route handler
        const response = await GET(request, {
          params: Promise.resolve({ id: order.id }),
        });
        const result = await response.json();

        // Assert: Returns 404 (order not found for this user)
        expect(response.status).toBe(404);
        expect(result.message).toBe("Order not found.");
      });
    });

    it("returns 401 for unauthenticated request", async () => {
      // Mock unauthenticated user
      mockUnauthenticatedApiUser();

      // Create request
      const request = new NextRequest(
        `http://localhost:3000/api/order/${faker.string.uuid()}`,
        {
          method: "GET",
        },
      );

      // Act: Call route handler
      const response = await GET(request, {
        params: Promise.resolve({ id: faker.string.uuid() }),
      });
      const result = await response.json();

      // Assert: Returns 401
      expect(response.status).toBe(401);
      expect(result.message).toBe("User is not authenticated.");
    });
  });
});
