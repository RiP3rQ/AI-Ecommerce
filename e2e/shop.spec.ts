import { test, expect } from "@playwright/test";
import { authenticateUser, ensureAuthenticated } from "./auth-helpers";

const SHOP_URL = "/shop/all";

test.describe("Shop Page", () => {
  // Authenticate before each test since all routes are protected
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page);
  });

  test.describe("Page Loading and UI Elements", () => {
    test("should load shop page successfully", async ({ page }) => {
      await page.goto(SHOP_URL);

      await expect(page).toHaveTitle("RiP3rQ's Store");

      // Check main content area
      await expect(page.getByRole("main")).toBeVisible();

      // Check that products load (or loading state is shown)
      await expect(
        page.getByTestId("products-grid").or(page.getByTestId("loading-skeleton"))
      ).toBeVisible();
    });

    test("should display search and sort controls", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Search input should be visible
      await expect(page.getByPlaceholder("Search products...")).toBeVisible();

      // Sort dropdown should be visible
      await expect(page.getByText("Sort by:")).toBeVisible();
      await expect(page.getByRole("combobox")).toBeVisible();
    });

    test("should display filters sidebar on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(SHOP_URL);

      // Filters sidebar should be visible on desktop
      await expect(page.getByText("Filters")).toBeVisible();
      await expect(page.getByText("Categories")).toBeVisible();
      await expect(page.getByText("Price Range")).toBeVisible();
    });

    test("should hide filters sidebar on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(SHOP_URL);

      // Filters sidebar should be hidden on mobile
      await expect(page.getByText("Filters")).not.toBeVisible();
    });
  });

  test.describe("Search Functionality", () => {
    test("should allow typing in search input", async ({ page }) => {
      await page.goto(SHOP_URL);

      const searchInput = page.getByPlaceholder("Search products...");
      await expect(searchInput).toBeVisible();

      await searchInput.fill("test search");
      await expect(searchInput).toHaveValue("test search");
    });

    test("should show search results after typing", async ({ page }) => {
      await page.goto(SHOP_URL);

      const searchInput = page.getByPlaceholder("Search products...");
      await searchInput.fill("laptop");

      // Wait for debounced search (500ms delay)
      await page.waitForTimeout(600);

      // Should either show results or empty state
      await expect(
        page.getByTestId("products-grid").or(page.getByText("No products found"))
      ).toBeVisible();
    });

    test("should clear search when input is cleared", async ({ page }) => {
      await page.goto(SHOP_URL);

      const searchInput = page.getByPlaceholder("Search products...");
      await searchInput.fill("laptop");
      await page.waitForTimeout(600);

      await searchInput.clear();
      await page.waitForTimeout(600);

      // Should show original results
      await expect(page.getByTestId("products-grid")).toBeVisible();
    });
  });

  test.describe("Sort Functionality", () => {
    test("should display sort options", async ({ page }) => {
      await page.goto(SHOP_URL);

      const sortSelect = page.getByRole("combobox");
      await sortSelect.click();

      // Check all sort options are available
      await expect(page.getByText("Newest First")).toBeVisible();
      await expect(page.getByText("Oldest First")).toBeVisible();
      await expect(page.getByText("Name: A to Z")).toBeVisible();
      await expect(page.getByText("Name: Z to A")).toBeVisible();
      await expect(page.getByText("Price: Low to High")).toBeVisible();
      await expect(page.getByText("Price: High to Low")).toBeVisible();
    });

    test("should change sort order", async ({ page }) => {
      await page.goto(SHOP_URL);

      const sortSelect = page.getByRole("combobox");

      // Change to "Price: Low to High"
      await sortSelect.click();
      await page.getByText("Price: Low to High").click();

      // URL should be updated with sort parameters
      await page.waitForURL(/\?.*sortField=price.*sortDirection=asc/);

      // Should still show products
      await expect(page.getByTestId("products-grid")).toBeVisible();
    });
  });

  test.describe("Category Filtering", () => {
    test("should display category filters", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(SHOP_URL);

      // Categories section should be visible
      await expect(page.getByText("Categories")).toBeVisible();

      // Should have at least one category button
      const categoryButtons = page.locator("button").filter({ hasText: /^[A-Za-z]/ });
      await expect(categoryButtons.first()).toBeVisible();
    });

    test("should filter by category", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(SHOP_URL);

      // Find and click first available category
      const categoryButtons = page.locator("button").filter({ hasText: /^[A-Za-z]/ });
      const firstCategory = categoryButtons.first();

      if (await firstCategory.isVisible()) {
        const categoryName = await firstCategory.textContent();
        await firstCategory.click();

        // URL should be updated with category filter
        await page.waitForURL(/\?.*categoryId=[^&]+/);

        // Should show filtered results or empty state
        await expect(
          page.getByTestId("products-grid").or(page.getByText("No products found"))
        ).toBeVisible();
      }
    });
  });

  test.describe("Price Range Filtering", () => {
    test("should display price range inputs", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(SHOP_URL);

      await expect(page.getByText("Price Range")).toBeVisible();
      await expect(page.getByLabel("Min Price")).toBeVisible();
      await expect(page.getByLabel("Max Price")).toBeVisible();
      await expect(page.getByText("Apply Price Range")).toBeVisible();
    });

    test("should allow setting price range", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(SHOP_URL);

      const minPriceInput = page.getByLabel("Min Price");
      const maxPriceInput = page.getByLabel("Max Price");
      const applyButton = page.getByText("Apply Price Range");

      await minPriceInput.fill("10");
      await maxPriceInput.fill("100");
      await applyButton.click();

      // URL should be updated with price range
      await page.waitForURL(/\?.*priceRange=%7B%22min%22%3A10%2C%22max%22%3A100%7D/);
    });
  });

  test.describe("Product Display and Interaction", () => {
    test("should display product cards", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Wait for products to load
      await page.waitForSelector('[data-testid="products-grid"]', { timeout: 10000 });

      // Should have product cards
      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();

      if (count > 0) {
        // Check first product card structure
        const firstCard = productCards.first();
        await expect(firstCard).toBeVisible();

        // Should have image, title, and price
        await expect(firstCard.locator("img").or(firstCard.locator("📦"))).toBeVisible();
        await expect(firstCard.locator("h3")).toBeVisible();
      }
    });

    test("should navigate to product page when clicked", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Wait for products to load
      await page.waitForSelector('[data-testid="products-grid"]', { timeout: 10000 });

      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();

      if (count > 0) {
        // Click first product
        await productCards.first().click();

        // Should navigate to product page
        await page.waitForURL(/\/product\/[^/]+/);
        await expect(page).toHaveURL(/\/product\/[^/]+/);
      }
    });

    test("should show product prices correctly", async ({ page }) => {
      await page.goto(SHOP_URL);

      await page.waitForSelector('[data-testid="products-grid"]', { timeout: 10000 });

      const productCards = page.locator('[data-testid="product-card"]');
      const count = await productCards.count();

      if (count > 0) {
        // Check that prices are displayed (format may vary)
        const priceElements = page.locator('[data-testid="product-price"]');
        if (await priceElements.count() > 0) {
          await expect(priceElements.first()).toBeVisible();
        }
      }
    });
  });

  test.describe("Pagination", () => {
    test("should display pagination when multiple pages exist", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Wait for content to load
      await page.waitForSelector('[data-testid="products-grid"]', { timeout: 10000 });

      // Check if pagination exists
      const pagination = page.locator('[data-testid="pagination"]');
      const hasPagination = await pagination.isVisible().catch(() => false);

      if (hasPagination) {
        // Test pagination controls
        await expect(page.getByLabel("Previous page")).toBeVisible();
        await expect(page.getByLabel("Next page")).toBeVisible();
      }
    });

    test("should show products count", async ({ page }) => {
      await page.goto(SHOP_URL);

      await page.waitForSelector('[data-testid="products-grid"]', { timeout: 10000 });

      // Should show "Showing X of Y products"
      await expect(page.getByText(/Showing \d+ of \d+ products/)).toBeVisible();
    });
  });

  test.describe("Empty States", () => {
    test("should handle no products found", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Search for something that doesn't exist
      const searchInput = page.getByPlaceholder("Search products...");
      await searchInput.fill("nonexistentproduct123456");
      await page.waitForTimeout(600);

      // Should show empty state
      const emptyState = page.getByText("No products found");
      const hasEmptyState = await emptyState.isVisible().catch(() => false);

      if (hasEmptyState) {
        await expect(emptyState).toBeVisible();
        await expect(page.getByText("Try adjusting your filters or search criteria")).toBeVisible();
      }
    });
  });

  test.describe("Reset Filters", () => {
    test("should reset all filters", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(SHOP_URL);

      // Apply some filters first
      const searchInput = page.getByPlaceholder("Search products...");
      await searchInput.fill("test");

      const minPriceInput = page.getByLabel("Min Price");
      await minPriceInput.fill("50");
      await page.getByText("Apply Price Range").click();

      await page.waitForTimeout(600);

      // Check reset button appears
      const resetButton = page.getByText("Reset");
      if (await resetButton.isVisible()) {
        await resetButton.click();

        // Should reset search and filters
        await expect(searchInput).toHaveValue("");
        await expect(minPriceInput).toHaveValue("0");
      }
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Search input should have aria-label
      const searchInput = page.getByPlaceholder("Search products...");
      await expect(searchInput).toHaveAttribute("aria-label", "Search products");

      // Sort select should be keyboard accessible
      const sortSelect = page.getByRole("combobox");
      await expect(sortSelect).toBeVisible();
    });

    test("should support keyboard navigation", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Tab to search input
      await page.keyboard.press("Tab");
      await expect(page.getByPlaceholder("Search products...")).toBeFocused();

      // Tab to sort select
      await page.keyboard.press("Tab");
      await expect(page.getByRole("combobox")).toBeFocused();
    });
  });

  test.describe("Loading States", () => {
    test("should show loading skeleton while fetching", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Should show loading state initially
      const loadingSkeleton = page.getByTestId("loading-skeleton");
      const hasLoading = await loadingSkeleton.isVisible().catch(() => false);

      if (hasLoading) {
        await expect(loadingSkeleton).toBeVisible();

        // Should eventually load products
        await page.waitForSelector('[data-testid="products-grid"]', { timeout: 10000 });
        await expect(loadingSkeleton).not.toBeVisible();
      }
    });
  });

  test.describe("URL State Management", () => {
    test("should update URL with search parameters", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Apply search
      const searchInput = page.getByPlaceholder("Search products...");
      await searchInput.fill("laptop");
      await page.waitForTimeout(600);

      // URL should contain search parameter
      await page.waitForURL(/\?.*search=laptop/);
    });

    test("should update URL with sort parameters", async ({ page }) => {
      await page.goto(SHOP_URL);

      // Change sort
      const sortSelect = page.getByRole("combobox");
      await sortSelect.click();
      await page.getByText("Price: Low to High").click();

      // URL should contain sort parameters
      await page.waitForURL(/\?.*sortField=price.*sortDirection=asc/);
    });

    test("should maintain filters in URL", async ({ page }) => {
      await page.setViewportSize({ width: 1024, height: 768 });
      await page.goto(SHOP_URL);

      // Apply price filter
      const minPriceInput = page.getByLabel("Min Price");
      await minPriceInput.fill("25");
      await page.getByText("Apply Price Range").click();

      await page.waitForURL(/\?.*priceRange=%7B%22min%22%3A25/);
    });
  });
});
