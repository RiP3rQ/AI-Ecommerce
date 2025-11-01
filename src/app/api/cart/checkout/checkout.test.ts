import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  vi,
  afterEach,
} from "vitest";
import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";
import { POST } from "./route";
import { checkoutService } from "./service";
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
import { createCategoryFixture } from "@/test/fixtures/categories";
import { carts, cartItems } from "@/database/schemas/cart";
import { orders, orderItems } from "@/database/schemas/orders";
import {
  mockAuthenticatedApiUser,
  mockUnauthenticatedApiUser,
} from "@/test/setup/test-setup";
import type { CheckoutResponse } from "./dto";
import { eq } from "drizzle-orm";
import { productVariants } from "@/database/schema";

/**
 * Comprehensive test suite for the checkout API endpoint.
 * Tests cover service layer, route handlers, edge cases, and error handling.
 */
describe("/api/cart/checkout", () => {
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

  describe("CheckoutService - Unit Tests", () => {
    describe("completeCheckout", () => {
      it("successfully completes checkout with cart items", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, variant, and cart with items
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
            overrides: { title: "Checkout Test Product", categoryId },
          });

          const variant1 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const variant2 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 500,
              currencyCode: "USD",
            },
          });

          // Create cart and add items
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values([
            { cartId: cart.id, productVariantId: variant1.id, quantity: 2 },
            { cartId: cart.id, productVariantId: variant2.id, quantity: 1 },
          ]);

          // Act: Complete checkout
          const result = await checkoutService.completeCheckout({
            userId: profile.id,
            db,
          });

          // Assert: Order created with correct details
          expect(result).toHaveProperty("orderId");
          expect(result.totalItems).toBe(3); // 2 + 1
          expect(result.totalPrice).toBe(2500); // (2 * 1000) + (1 * 500)
          expect(result.currencyCode).toBe("USD");

          // Assert: Order exists in database
          const createdOrder = await db.query.orders.findFirst({
            where: (orders, { eq }) => eq(orders.id, result.orderId),
          });
          expect(createdOrder).toBeDefined();
          expect(createdOrder!.userId).toBe(profile.id);
          expect(createdOrder!.totalPrice).toBe(2500);
          expect(createdOrder!.status).toBe("completed");

          // Assert: Order items created
          const createdOrderItems = await db.query.orderItems.findMany({
            where: (orderItems, { eq }) =>
              eq(orderItems.orderId, result.orderId),
          });
          expect(createdOrderItems).toHaveLength(2);

          // Assert: Cart is cleared
          const remainingCartItems = await db.query.cartItems.findMany({
            where: (cartItems, { eq }) => eq(cartItems.cartId, cart.id),
          });
          expect(remainingCartItems).toHaveLength(0);
        });
      });

      it("throws EmptyCartError when cart is empty", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile with empty cart
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          // Act & Assert: Complete checkout with empty cart
          await expect(
            checkoutService.completeCheckout({
              userId: profile.id,
              db,
            }),
          ).rejects.toThrow("Cannot checkout with an empty cart.");
        });
      });

      it("handles checkout with single cart item", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, variant, and cart with single item
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
            overrides: { title: "Single Item Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 750,
              currencyCode: "EUR",
            },
          });

          // Create cart and add single item
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values({
            cartId: cart.id,
            productVariantId: variant.id,
            quantity: 1,
          });

          // Act: Complete checkout
          const result = await checkoutService.completeCheckout({
            userId: profile.id,
            db,
          });

          // Assert: Order created with correct details
          expect(result.totalItems).toBe(1);
          expect(result.totalPrice).toBe(750);
          expect(result.currencyCode).toBe("EUR");

          // Assert: Order items created correctly
          const createdOrderItems = await db.query.orderItems.findMany({
            where: (orderItems, { eq }) =>
              eq(orderItems.orderId, result.orderId),
          });
          expect(createdOrderItems).toHaveLength(1);
          expect(createdOrderItems[0].quantity).toBe(1);
          expect(createdOrderItems[0].priceAtPurchase).toBe(750);
        });
      });

      it("preserves price at time of purchase", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create cart with items
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
            overrides: { title: "Price Preservation Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1200, // Original price: $12.00
              currencyCode: "USD",
            },
          });

          // Create cart and add item
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values({
            cartId: cart.id,
            productVariantId: variant.id,
            quantity: 1,
          });

          // Simulate price change after cart creation (but before checkout)
          await db
            .update(productVariants)
            .set({ price: 1500, updatedAt: new Date() }) // New price: $15.00
            .where(eq(productVariants.id, variant.id));

          // Act: Complete checkout
          const result = await checkoutService.completeCheckout({
            userId: profile.id,
            db,
          });

          // Assert: Order uses original price at time of cart creation
          expect(result.totalPrice).toBe(1200); // Original price preserved

          // Assert: Order item stores price at purchase
          const createdOrderItems = await db.query.orderItems.findMany({
            where: (orderItems, { eq }) =>
              eq(orderItems.orderId, result.orderId),
          });
          expect(createdOrderItems[0].priceAtPurchase).toBe(1200); // Original price
        });
      });
    });
  });

  describe("Unauthorized Access Tests", () => {
    beforeEach(() => {
      mockUnauthenticatedApiUser();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("returns 401 for POST /api/cart/checkout when user is not authenticated", async () => {
      // Arrange
      const request = new NextRequest(
        "http://localhost:3000/api/cart/checkout",
        {
          method: "POST",
          body: JSON.stringify({}),
        },
      );

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe("Integration Tests - Route Handlers", () => {
    let mockUser: any;
    let profile: any;

    beforeEach(async () => {
      mockUser = mockAuthenticatedApiUser({ id: faker.string.uuid() });
      // Create a profile in the database that matches the mock user
      const db = createTestDb();
      profile = await createProfileFixture({
        db,
        overrides: { id: mockUser.id },
      });
      await dbHelpers.truncateCartTables(db);
      await dbHelpers.truncateOrderTables(db);
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe("POST /api/cart/checkout", () => {
      it("successfully completes checkout via API", async () => {
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
            overrides: { title: "API Checkout Product", categoryId },
          });

          const variant1 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 2000,
              currencyCode: "USD",
            },
          });

          const variant2 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 800,
              currencyCode: "USD",
            },
          });

          // Create cart and add items
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values([
            { cartId: cart.id, productVariantId: variant1.id, quantity: 1 },
            { cartId: cart.id, productVariantId: variant2.id, quantity: 2 },
          ]);

          const request = new NextRequest(
            "http://localhost:3000/api/cart/checkout",
            {
              method: "POST",
              body: JSON.stringify({}),
            },
          );

          // Act
          const response = await POST(request);
          const result = (await response.json()) as CheckoutResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.success).toBe(true);
          expect(result).toHaveProperty("orderId");
          expect(result.totalItems).toBe(3); // 1 + 2
          expect(result.totalPrice).toBe(3600); // (1 * 2000) + (2 * 800)
          expect(result.currencyCode).toBe("USD");
          expect(result.message).toBe("Purchase completed successfully");
        } finally {
          // Clean up
          await dbHelpers.truncateCartTables(db);
          await dbHelpers.truncateProductTables(db);
          await dbHelpers.truncateOrderTables(db);
        }
      });

      it("returns 400 for empty cart", async () => {
        // Arrange
        const request = new NextRequest(
          "http://localhost:3000/api/cart/checkout",
          {
            method: "POST",
            body: JSON.stringify({}),
          },
        );

        // Act
        const response = await POST(request);

        // Assert
        expect(response.status).toBe(400);

        const result = await response.json();
        expect(result.message).toBe("Cannot checkout with an empty cart.");
      });

      it("handles malformed JSON gracefully", async () => {
        // Arrange: Create request with invalid JSON
        const request = new NextRequest(
          "http://localhost:3000/api/cart/checkout",
          {
            method: "POST",
            body: "invalid json",
          },
        );

        // Act
        const response = await POST(request);

        // Assert: Should return 400 due to JSON parsing error
        expect(response.status).toBe(400);
      });
    });
  });

  describe("Edge Cases and Additional Error Handling", () => {
    describe("Database Transaction Rollback", () => {
      it("rolls back transaction if order creation fails", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile with cart items
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
            overrides: { title: "Transaction Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Create cart and add item
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values({
            cartId: cart.id,
            productVariantId: variant.id,
            quantity: 1,
          });

          // Mock the insert to fail for orders table
          const originalInsert = db.insert;
          db.insert = vi.fn().mockImplementation((table: any) => {
            if (table === orders) {
              return {
                values: vi.fn().mockReturnThis(),
                returning: vi.fn().mockResolvedValue([]), // Simulate failure
              };
            }
            return originalInsert(table);
          });

          // Act & Assert: Checkout should fail and cart should remain
          await expect(
            checkoutService.completeCheckout({
              userId: profile.id,
              db,
            }),
          ).rejects.toThrow();

          // Assert: Cart items still exist (transaction rolled back)
          const remainingCartItems = await db.query.cartItems.findMany({
            where: (cartItems, { eq }) => eq(cartItems.cartId, cart.id),
          });
          expect(remainingCartItems).toHaveLength(1);

          // Assert: No orders were created
          const allOrders = await db.query.orders.findMany();
          expect(allOrders).toHaveLength(0);
        });
      });
    });

    describe("Concurrent Checkout Attempts", () => {
      it("handles multiple concurrent checkout requests gracefully", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile and cart with items
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
            overrides: { title: "Concurrent Checkout Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 500,
              currencyCode: "USD",
            },
          });

          // Create cart and add item
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values({
            cartId: cart.id,
            productVariantId: variant.id,
            quantity: 1,
          });

          // Act: Attempt multiple concurrent checkouts
          const checkoutPromises = [
            checkoutService.completeCheckout({ userId: profile.id, db }),
            checkoutService.completeCheckout({ userId: profile.id, db }),
            checkoutService.completeCheckout({ userId: profile.id, db }),
          ];

          // Wait for all to complete or fail
          const results = await Promise.allSettled(checkoutPromises);

          // Assert: Exactly one checkout should succeed
          const successfulCheckouts = results.filter(
            (result) => result.status === "fulfilled",
          );
          const failedCheckouts = results.filter(
            (result) => result.status === "rejected",
          );

          expect(successfulCheckouts).toHaveLength(1);
          expect(failedCheckouts).toHaveLength(2);

          // Verify the failed checkouts are due to empty cart
          failedCheckouts.forEach((failure) => {
            expect((failure as PromiseRejectedResult).reason.message).toBe(
              "Cannot checkout with an empty cart.",
            );
          });
        });
      });
    });
  });
});
