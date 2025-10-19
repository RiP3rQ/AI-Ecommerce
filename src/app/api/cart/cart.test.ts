import {
  describe,
  it,
  expect,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
  vi,
  Mock,
} from "vitest";
import { faker } from "@faker-js/faker";
import { NextRequest } from "next/server";
import { GET, POST, PATCH, DELETE } from "./route";
import { cartService } from "./service";
import {
  createTestableUnit,
  dbHelpers,
  createTestDb,
} from "@/test/utils/db-helper";
import { createProfileFixture } from "@/test/fixtures/profiles";
import {
  createProductFixture,
  createProductVariantFixture,
  createProductVariantFixtures,
} from "@/test/fixtures/products";
import { carts, cartItems } from "@/database/schemas/cart";
import type { CartResponse, DeleteCartItemResponse } from "./types";
import {
  mockAuthenticatedApiUser,
  mockUnauthenticatedApiUser,
  mockValidateServerSession,
} from "@/test/setup/test-setup";
import { createCategoryFixture } from "@/test/fixtures/categories";

/**
 * Comprehensive test suite for the cart API endpoint.
 * Tests cover service layer, route handlers, edge cases, and error handling.
 */
describe("/api/cart", () => {
  beforeAll(async () => {
    await dbHelpers.truncateCartTables();
    await dbHelpers.truncateProductTables();
  });

  afterAll(async () => {
    await dbHelpers.truncateCartTables();
    await dbHelpers.truncateProductTables();
  });

  beforeEach(async () => {
    // Ensure clean state before each test
    await dbHelpers.truncateCartTables();
    await dbHelpers.truncateProductTables();
  });

  describe("CartService - Unit Tests", () => {
    describe("getOrCreateCart", () => {
      it("creates a new cart for a user who doesn't have one", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create a test profile
          const userId = faker.string.uuid();
          const profile = await createProfileFixture({
            db,
            overrides: { id: userId },
          });

          // Act: Get or create cart
          const cartId = await cartService.getOrCreateCart({
            userId: profile.id,
            db,
          });

          // Assert: Cart ID is returned
          expect(cartId).toBeDefined();
          expect(typeof cartId).toBe("string");

          // Assert: Cart exists in database
          const cart = await db.query.carts.findFirst({
            where: (carts, { eq }) => eq(carts.userId, profile.id),
          });
          expect(cart).toBeDefined();
          expect(cart!.id).toBe(cartId);
        });
      });

      it("returns existing cart for a user who already has one", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create a test profile and cart
          const userId = faker.string.uuid();
          const profile = await createProfileFixture({
            db,
            overrides: { id: userId },
          });

          const [existingCart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          // Act: Get or create cart
          const cartId = await cartService.getOrCreateCart({
            userId: profile.id,
            db,
          });

          // Assert: Returns the existing cart ID
          expect(cartId).toBe(existingCart.id);

          // Assert: Only one cart exists for this user
          const userCarts = await db.query.carts.findMany({
            where: (carts, { eq }) => eq(carts.userId, profile.id),
          });
          expect(userCarts).toHaveLength(1);
        });
      });
    });

    describe("getCart", () => {
      it("returns empty cart with no items for new user", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create a test profile
          const userId = faker.string.uuid();
          const profile = await createProfileFixture({
            db,
            overrides: { id: userId },
          });

          // Act: Get cart
          const cartSummary = await cartService.getCart({
            userId: profile.id,
            db,
          });

          // Assert: Cart summary structure
          expect(cartSummary).toHaveProperty("cart");
          expect(cartSummary).toHaveProperty("totalItems", 0);
          expect(cartSummary).toHaveProperty("totalPrice", 0);
          expect(cartSummary).toHaveProperty("currencyCode", "USD");

          // Assert: Cart has no items
          expect(cartSummary.cart.items).toEqual([]);
        });
      });

      it("returns cart with items and correct totals", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, and variants
          const userId = faker.string.uuid();
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const profile = await createProfileFixture({
            db,
            overrides: { id: userId },
          });

          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant1 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000, // $10.00
              currencyCode: "USD",
            },
          });

          const variant2 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 500, // $5.00
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

          // Act: Get cart
          const cartSummary = await cartService.getCart({
            userId: profile.id,
            db,
          });

          // Assert: Cart has correct totals
          expect(cartSummary.totalItems).toBe(3); // 2 + 1
          expect(cartSummary.totalPrice).toBe(2500); // (2 * 1000) + (1 * 500) = 2500 cents = $25.00
          expect(cartSummary.currencyCode).toBe("USD");
          expect(cartSummary.cart.items).toHaveLength(2);

          // Assert: Items have correct structure
          cartSummary.cart.items.forEach((item) => {
            expect(item).toHaveProperty("quantity");
            expect(item).toHaveProperty("productVariant");
            expect(item.productVariant).toHaveProperty("product");
          });
        });
      });
    });

    describe("addItemToCart", () => {
      it("adds new item to cart", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, and variant
          const userId = faker.string.uuid();
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const profile = await createProfileFixture({
            db,
            overrides: { id: userId },
          });

          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Act: Add item to cart
          const cartSummary = await cartService.addItemToCart({
            userId: profile.id,
            dto: { productVariantId: variant.id, quantity: 2 },
            db,
          });

          // Assert: Cart has the item
          expect(cartSummary.totalItems).toBe(2);
          expect(cartSummary.totalPrice).toBe(2000);
          expect(cartSummary.cart.items).toHaveLength(1);
          expect(cartSummary.cart.items[0].quantity).toBe(2);
          expect(cartSummary.cart.items[0].productVariantId).toBe(variant.id);
        });
      });

      it("increases quantity when adding existing item", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, variant, and existing cart item
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Create cart and add initial item
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values({
            cartId: cart.id,
            productVariantId: variant.id,
            quantity: 1,
          });

          // Act: Add more of the same item
          const cartSummary = await cartService.addItemToCart({
            userId: profile.id,
            dto: { productVariantId: variant.id, quantity: 3 },
            db,
          });

          // Assert: Quantity increased
          expect(cartSummary.totalItems).toBe(4); // 1 + 3
          expect(cartSummary.totalPrice).toBe(4000); // 4 * 1000
          expect(cartSummary.cart.items).toHaveLength(1);
          expect(cartSummary.cart.items[0].quantity).toBe(4);
        });
      });

      it("throws InvalidQuantityError for quantity <= 0", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, and variant
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Act & Assert: Add item with invalid quantity
          await expect(
            cartService.addItemToCart({
              userId: profile.id,
              dto: { productVariantId: variant.id, quantity: 0 },
              db,
            })
          ).rejects.toThrow(
            "Invalid quantity. Quantity must be greater than 0."
          );
        });
      });

      it("throws ProductVariantNotFoundError for unavailable variant", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile and unavailable variant
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              availableForSale: false,
            },
          });

          // Act & Assert: Add unavailable item
          await expect(
            cartService.addItemToCart({
              userId: profile.id,
              dto: { productVariantId: variant.id, quantity: 1 },
              db,
            })
          ).rejects.toThrow("Product variant not found or unavailable.");
        });
      });

      it("throws InsufficientInventoryError when exceeding inventory", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, and variant with limited inventory
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              inventoryQuantity: 5,
            },
          });

          // Act & Assert: Try to add more than available inventory
          await expect(
            cartService.addItemToCart({
              userId: profile.id,
              dto: { productVariantId: variant.id, quantity: 10 },
              db,
            })
          ).rejects.toThrow("Only 5 units available.");
        });
      });
    });

    describe("updateCartItem", () => {
      it("updates quantity of existing cart item", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, variant, cart, and cart item
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          const [cartItem] = await db
            .insert(cartItems)
            .values({
              cartId: cart.id,
              productVariantId: variant.id,
              quantity: 2,
            })
            .returning();

          // Act: Update cart item quantity
          const cartSummary = await cartService.updateCartItem({
            userId: profile.id,
            dto: { cartItemId: cartItem.id, quantity: 5 },
            db,
          });

          // Assert: Quantity updated
          expect(cartSummary.totalItems).toBe(5);
          expect(cartSummary.totalPrice).toBe(5000);
          expect(cartSummary.cart.items[0].quantity).toBe(5);
        });
      });

      it("throws InvalidQuantityError for quantity <= 0", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, variant, cart, and cart item
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          const [cartItem] = await db
            .insert(cartItems)
            .values({
              cartId: cart.id,
              productVariantId: variant.id,
              quantity: 2,
            })
            .returning();

          // Act & Assert: Update with invalid quantity
          await expect(
            cartService.updateCartItem({
              userId: profile.id,
              dto: { cartItemId: cartItem.id, quantity: 0 },
              db,
            })
          ).rejects.toThrow(
            "Invalid quantity. Quantity must be greater than 0."
          );
        });
      });

      it("throws CartItemNotFoundError for non-existent cart item", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          // Act & Assert: Update non-existent cart item
          await expect(
            cartService.updateCartItem({
              userId: profile.id,
              dto: { cartItemId: "non-existent-id", quantity: 1 },
              db,
            })
          ).rejects.toThrow("Cart item not found.");
        });
      });
    });

    describe("removeCartItem", () => {
      it("should remove item from cart", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, variant, cart, and cart item
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          const [cartItem] = await db
            .insert(cartItems)
            .values({
              cartId: cart.id,
              productVariantId: variant.id,
              quantity: 3,
            })
            .returning();

          // Act: Remove cart item
          const cartSummary = await cartService.removeCartItem({
            userId: profile.id,
            dto: { cartItemId: cartItem.id },
            db,
          });

          // Assert: Item removed
          expect(cartSummary.totalItems).toBe(0);
          expect(cartSummary.totalPrice).toBe(0);
          expect(cartSummary.cart.items).toHaveLength(0);
        });
      });

      it("throws CartItemNotFoundError for non-existent cart item", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });

          // Act & Assert: Remove non-existent cart item
          await expect(
            cartService.removeCartItem({
              userId: profile.id,
              dto: { cartItemId: "non-existent-id" },
              db,
            })
          ).rejects.toThrow("Cart item not found.");
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

    it("returns 401 for GET /api/cart when user is not authenticated", async () => {
      // Arrange
      const request = new NextRequest("http://localhost:3000/api/cart");

      // Act
      const response = await GET(request);

      // Assert
      expect(response.status).toBe(401);
    });

    it("returns 401 for POST /api/cart when user is not authenticated", async () => {
      // Arrange
      const request = new NextRequest("http://localhost:3000/api/cart", {
        method: "POST",
        body: JSON.stringify({
          productVariantId: faker.string.uuid(),
          quantity: 1,
        }),
      });

      // Act
      const response = await POST(request);

      // Assert
      expect(response.status).toBe(401);
    });

    it("returns 401 for PATCH /api/cart when user is not authenticated", async () => {
      // Arrange
      const request = new NextRequest("http://localhost:3000/api/cart", {
        method: "PATCH",
        body: JSON.stringify({
          cartItemId: faker.string.uuid(),
          quantity: 2,
        }),
      });

      // Act
      const response = await PATCH(request);

      // Assert
      expect(response.status).toBe(401);
    });

    it("returns 401 for DELETE /api/cart when user is not authenticated", async () => {
      // Arrange
      const request = new NextRequest("http://localhost:3000/api/cart", {
        method: "DELETE",
        body: JSON.stringify({
          cartItemId: faker.string.uuid(),
        }),
      });

      // Act
      const response = await DELETE(request);

      // Assert
      expect(response.status).toBe(401);
    });
  });

  describe("Integration Tests - Route Handlers", () => {
    const mockUser = mockAuthenticatedApiUser({ id: faker.string.uuid() });

    afterEach(() => {
      vi.clearAllMocks();
    });

    describe("GET /api/cart", () => {
      it("returns empty cart for new user", async () => {
        // Arrange
        const request = new NextRequest("http://localhost:3000/api/cart");

        // Act
        const response = await GET(request);
        const result = (await response.json()) as CartResponse;

        // Assert
        expect(response.status).toBe(200);
        expect(result.success).toBe(true);
        expect(result.data.totalItems).toBe(0);
        expect(result.data.totalPrice).toBe(0);
        expect(result.data.cart.items).toEqual([]);
        expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
      });

      it("returns cart with items", async () => {
        // Arrange: Seed data in test database
        const db = createTestDb();
        try {
          const userId = faker.string.uuid();
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const profile = await createProfileFixture({
            db,
            overrides: { id: userId },
          });

          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant1 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1500,
              currencyCode: "USD",
            },
          });

          const variant2 = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 2000,
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

          const request = new NextRequest("http://localhost:3000/api/cart");

          // Act
          const response = await GET(request);
          const result = (await response.json()) as CartResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.success).toBe(true);
          expect(result.data.totalItems).toBe(3);
          expect(result.data.totalPrice).toBe(5000); // (2 * 1500) + (1 * 2000)
          expect(result.data.cart.items).toHaveLength(2);
          expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
        } finally {
          // Clean up
          await dbHelpers.truncateCartTables(db);
          await dbHelpers.truncateProductTables(db);
        }
      });

      it("handles optional cartId query parameter", async () => {
        // Arrange
        const request = new NextRequest(
          "http://localhost:3000/api/cart?cartId=some-cart-id"
        );

        // Act
        const response = await GET(request);

        // Assert: cartId is optional
        expect(response.status).toBe(200);
        expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
      });
    });

    describe("POST /api/cart", () => {
      it("adds item to cart successfully", async () => {
        // Arrange: Seed product data
        const db = createTestDb();
        try {
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "POST Test Product" },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const request = new NextRequest("http://localhost:3000/api/cart", {
            method: "POST",
            body: JSON.stringify({
              productVariantId: variant.id,
              quantity: 2,
            }),
          });

          // Act
          const response = await POST(request);
          const result = (await response.json()) as CartResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.success).toBe(true);
          expect(result.data.totalItems).toBe(2);
          expect(result.data.totalPrice).toBe(2000);
          expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
        } finally {
          // Clean up
          await dbHelpers.truncateCartTables(db);
          await dbHelpers.truncateProductTables(db);
        }
      });

      it("returns 400 for invalid request body", async () => {
        // Arrange: Invalid quantity
        const request = new NextRequest("http://localhost:3000/api/cart", {
          method: "POST",
          body: JSON.stringify({
            productVariantId: "invalid-uuid",
            quantity: 0,
          }),
        });

        // Act
        const response = await POST(request);

        // Assert
        expect(response.status).toBe(400);
        expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
      });
    });

    describe("PATCH /api/cart", () => {
      it("updates cart item quantity successfully", async () => {
        // Arrange: Seed data and create cart item
        const db = createTestDb();
        try {
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "PATCH Test Product" },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Create cart and cart item
          const [cart] = await db
            .insert(carts)
            .values({ userId: mockUser.id })
            .returning();

          const [cartItem] = await db
            .insert(cartItems)
            .values({
              cartId: cart.id,
              productVariantId: variant.id,
              quantity: 1,
            })
            .returning();

          const request = new NextRequest("http://localhost:3000/api/cart", {
            method: "PATCH",
            body: JSON.stringify({
              cartItemId: cartItem.id,
              quantity: 3,
            }),
          });

          // Act
          const response = await PATCH(request);
          const result = (await response.json()) as CartResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.success).toBe(true);
          expect(result.data.totalItems).toBe(3);
          expect(result.data.totalPrice).toBe(3000);
          expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
        } finally {
          // Clean up
          await dbHelpers.truncateCartTables(db);
          await dbHelpers.truncateProductTables(db);
        }
      });

      it("returns 404 for non-existent cart item", async () => {
        // Arrange
        const request = new NextRequest("http://localhost:3000/api/cart", {
          method: "PATCH",
          body: JSON.stringify({
            cartItemId: "non-existent-id",
            quantity: 1,
          }),
        });

        // Act
        const response = await PATCH(request);

        // Assert
        expect(response.status).toBe(404);
        expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
      });
    });

    describe("DELETE /api/cart", () => {
      it("removes cart item successfully", async () => {
        // Arrange: Seed data and create cart item
        const db = createTestDb();
        try {
          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const profile = await createProfileFixture({
            db,
            overrides: { id: faker.string.uuid() },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "DELETE Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Create cart and cart item
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          const [cartItem] = await db
            .insert(cartItems)
            .values({
              cartId: cart.id,
              productVariantId: variant.id,
              quantity: 2,
            })
            .returning();

          const request = new NextRequest("http://localhost:3000/api/cart", {
            method: "DELETE",
            body: JSON.stringify({
              cartItemId: cartItem.id,
            }),
          });

          // Act
          const response = await DELETE(request);
          const result = (await response.json()) as DeleteCartItemResponse;

          // Assert
          expect(response.status).toBe(200);
          expect(result.success).toBe(true);
          expect(result.message).toBe("Item removed from cart successfully.");
          expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
        } finally {
          // Clean up
          await dbHelpers.truncateCartTables(db);
          await dbHelpers.truncateProductTables(db);
        }
      });

      it("returns 404 for non-existent cart item", async () => {
        // Arrange
        const request = new NextRequest("http://localhost:3000/api/cart", {
          method: "DELETE",
          body: JSON.stringify({
            cartItemId: "non-existent-id",
          }),
        });

        // Act
        const response = await DELETE(request);

        // Assert
        expect(response.status).toBe(404);
        expect(mockValidateServerSession).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Edge Cases and Additional Error Handling", () => {
    describe("Inventory and Quantity Validation", () => {
      it("handles adding item when inventory becomes insufficient after initial add", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, and variant with limited inventory
          const profile = await createProfileFixture({
            db,
            overrides: { id: "edge-user-1" },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Limited Stock Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              inventoryQuantity: 5,
            },
          });

          // First add 3 items (should succeed)
          await cartService.addItemToCart({
            userId: profile.id,
            dto: { productVariantId: variant.id, quantity: 3 },
            db,
          });

          // Act & Assert: Try to add 3 more (should fail due to insufficient inventory)
          await expect(
            cartService.addItemToCart({
              userId: profile.id,
              dto: { productVariantId: variant.id, quantity: 3 },
              db,
            })
          ).rejects.toThrow(
            "Only 5 units available. You already have 3 in your cart."
          );
        });
      });

      it("handles unlimited inventory (null inventoryQuantity)", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile, product, and variant with unlimited inventory
          const profile = await createProfileFixture({
            db,
            overrides: { id: "edge-user-2" },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Unlimited Stock Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              inventoryQuantity: null, // Unlimited stock
            },
          });

          // Act: Add large quantity
          const cartSummary = await cartService.addItemToCart({
            userId: profile.id,
            dto: { productVariantId: variant.id, quantity: 1000 },
            db,
          });

          // Assert: Should succeed
          expect(cartSummary.totalItems).toBe(1000);
        });
      });
    });

    describe("Currency and Price Calculations", () => {
      it("handles mixed currencies correctly", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile and products with different currencies
          const profile = await createProfileFixture({
            db,
            overrides: { id: "edge-user-3" },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product1 = await createProductFixture({
            db,
            overrides: { title: "USD Product", categoryId },
          });

          const product2 = await createProductFixture({
            db,
            overrides: { title: "EUR Product" },
          });

          const usdVariant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product1.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          const eurVariant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product2.id,
              price: 900,
              currencyCode: "EUR",
            },
          });

          // Add items with different currencies
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          await db.insert(cartItems).values([
            { cartId: cart.id, productVariantId: usdVariant.id, quantity: 1 },
            { cartId: cart.id, productVariantId: eurVariant.id, quantity: 1 },
          ]);

          // Act: Get cart
          const cartSummary = await cartService.getCart({
            userId: profile.id,
            db,
          });

          // Assert: Currency should be from first item (USD in this case)
          expect(cartSummary.currencyCode).toBe("USD");
          expect(cartSummary.totalPrice).toBe(1900); // 1000 + 900
        });
      });

      it("calculates prices correctly with zero quantity items", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create cart with items, then remove all
          const profile = await createProfileFixture({
            db,
            overrides: { id: "edge-user-4" },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Create cart and add item, then remove it
          const [cart] = await db
            .insert(carts)
            .values({ userId: profile.id })
            .returning();

          const [cartItem] = await db
            .insert(cartItems)
            .values({
              cartId: cart.id,
              productVariantId: variant.id,
              quantity: 1,
            })
            .returning();

          // Remove the item
          await cartService.removeCartItem({
            userId: profile.id,
            dto: { cartItemId: cartItem.id },
          });

          // Act: Get cart again
          const cartSummary = await cartService.getCart({
            userId: profile.id,
            db,
          });

          // Assert: Cart should be empty
          expect(cartSummary.totalItems).toBe(0);
          expect(cartSummary.totalPrice).toBe(0);
          expect(cartSummary.cart.items).toHaveLength(0);
        });
      });
    });

    describe("Database Constraints and Race Conditions", () => {
      it("handles concurrent cart operations gracefully", async () => {
        await createTestableUnit(async (db) => {
          // Arrange: Create profile and product
          const profile = await createProfileFixture({
            db,
            overrides: { id: "edge-user-5" },
          });

          const categoryId = faker.string.uuid();
          const category = await createCategoryFixture({
            db,
            overrides: { name: "Test Category", id: categoryId },
          });
          const product = await createProductFixture({
            db,
            overrides: { title: "Concurrent Test Product", categoryId },
          });

          const variant = await createProductVariantFixture({
            db,
            overrides: {
              productId: product.id,
              price: 1000,
              currencyCode: "USD",
            },
          });

          // Act: Perform multiple operations simultaneously
          const operations = [
            cartService.addItemToCart({
              userId: profile.id,
              dto: { productVariantId: variant.id, quantity: 1 },
              db,
            }),
            cartService.addItemToCart({
              userId: profile.id,
              dto: { productVariantId: variant.id, quantity: 1 },
              db,
            }),
            cartService.addItemToCart({
              userId: profile.id,
              dto: { productVariantId: variant.id, quantity: 1 },
              db,
            }),
          ];

          // Wait for all operations to complete
          const results = await Promise.all(operations);

          // Assert: All operations should succeed and quantities should accumulate
          const finalCart = await cartService.getCart({
            userId: profile.id,
            db,
          });
          expect(finalCart.totalItems).toBe(3); // 1 + 1 + 1
          expect(finalCart.totalPrice).toBe(3000);
        });
      });
    });

    describe("Route Handler Error Scenarios", () => {
      const mockUser = mockAuthenticatedApiUser({ id: faker.string.uuid() });

      afterEach(() => {
        vi.clearAllMocks();
      });

      it("handles malformed JSON in request body", async () => {
        // Arrange: Create request with invalid JSON
        const request = new NextRequest("http://localhost:3000/api/cart", {
          method: "POST",
          body: "invalid json",
        });

        // Act
        const response = await POST(request);

        // Assert: Should return 400 due to JSON parsing error
        expect(response.status).toBe(400);
      });

      it("handles missing required fields in request body", async () => {
        // Arrange: Create request with incomplete body
        const request = new NextRequest("http://localhost:3000/api/cart", {
          method: "POST",
          body: JSON.stringify({
            // Missing productVariantId
            quantity: 1,
          }),
        });

        // Act
        const response = await POST(request);

        // Assert: Should return 400 due to validation error
        expect(response.status).toBe(400);
      });

      it("handles invalid UUID format in request body", async () => {
        // Arrange: Create request with invalid UUID
        const request = new NextRequest("http://localhost:3000/api/cart", {
          method: "POST",
          body: JSON.stringify({
            productVariantId: "not-a-valid-uuid",
            quantity: 1,
          }),
        });

        // Act
        const response = await POST(request);

        // Assert: Should return 400 due to validation error
        expect(response.status).toBe(400);
      });
    });
  });
});
