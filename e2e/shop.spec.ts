import { test, expect } from "@playwright/test";
import { ShopPage } from "./page-objects/shop-page";

test.describe("Shop Page", () => {
  test.describe("Page Loading and UI Elements", () => {
    test("should display search and sort controls", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Search input should be visible
      await expect(shopPage.searchInput).toBeVisible();

      // Sort dropdown should be visible
      await expect(page.getByText("Sort by:")).toBeVisible();
      await expect(shopPage.sortSelect).toBeVisible();
    });

    test("should display filters sidebar on desktop", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      // Filters sidebar should be visible on desktop
      await expect(shopPage.filtersText).toBeVisible();
      await expect(shopPage.categoriesText).toBeVisible();
      await expect(shopPage.priceRangeText).toBeVisible();
    });

    test("should hide filters sidebar on mobile", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setMobileViewport();
      await shopPage.goto();

      // Filters sidebar should be hidden on mobile
      await expect(shopPage.filtersText).not.toBeVisible();
    });
  });

  test.describe("Search Functionality", () => {
    test("should allow typing in search input", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await expect(shopPage.searchInput).toBeVisible();

      await shopPage.searchInput.fill("test search");
      await expect(shopPage.searchInput).toHaveValue("test search");
    });

    test("should show search results after typing", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.searchProducts("laptop");

      // Should either show results or empty state
      await expect(shopPage.productsGrid.or(shopPage.emptyState)).toBeVisible();
    });

    test("should clear search when input is cleared", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.searchProducts("laptop");

      await shopPage.clearSearch();

      // Should show original results
      await expect(shopPage.productsGrid).toBeVisible();
    });
  });

  test.describe("Sort Functionality", () => {
    test("should display sort options", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.sortSelect.click();

      // Check all sort options are available in the dropdown
      await expect(
        page
          .locator('[data-slot="select-item"]')
          .filter({ hasText: "Newest First" }),
      ).toBeVisible();
      await expect(
        page
          .locator('[data-slot="select-item"]')
          .filter({ hasText: "Oldest First" }),
      ).toBeVisible();
      await expect(
        page
          .locator('[data-slot="select-item"]')
          .filter({ hasText: "Name: A to Z" }),
      ).toBeVisible();
      await expect(
        page
          .locator('[data-slot="select-item"]')
          .filter({ hasText: "Name: Z to A" }),
      ).toBeVisible();
      await expect(
        page
          .locator('[data-slot="select-item"]')
          .filter({ hasText: "Price: Low to High" }),
      ).toBeVisible();
      await expect(
        page
          .locator('[data-slot="select-item"]')
          .filter({ hasText: "Price: High to Low" }),
      ).toBeVisible();
    });

    test("should change sort order", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Change to "Price: Low to High"
      await shopPage.selectSortOption("Price: Low to High");

      // URL should be updated with sort parameters
      // Fix: Accept URL-encoded filters (JSON stringified), so decode and check query param
      await expect(async () => {
        const url = new URL(page.url());
        const filtersParam = url.searchParams.get("filters");
        if (!filtersParam) throw new Error("filters param missing in URL");
        const filters = JSON.parse(decodeURIComponent(filtersParam));
        if (filters.sortField !== "price" || filters.sortDirection !== "asc") {
          throw new Error(
            `Sort params not applied in URL: ${JSON.stringify(filters)}`,
          );
        }
      }).toPass({ timeout: 10000 });

      // Should still show products
      await expect(shopPage.productsGrid).toBeVisible();
    });
  });

  test.describe("Category Filtering", () => {
    test("should display category filters", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      // Categories section should be visible
      await expect(shopPage.categoriesText).toBeVisible();

      // Should have at least one category button
      await expect(shopPage.categoryButtons.first()).toBeVisible();
    });
  });

  test.describe("Price Range Filtering", () => {
    test("should display price range inputs", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await expect(shopPage.priceRangeText).toBeVisible();
      await expect(shopPage.minPriceInput).toBeVisible();
      await expect(shopPage.maxPriceInput).toBeVisible();
      await expect(shopPage.applyPriceRangeButton).toBeVisible();
    });

    test("should allow setting price range", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await shopPage.setPriceRange("10", "100");

      // URL should be updated with price range
      // Wait for URL to contain price range filter (handle encoded filters param)
      await shopPage.waitForUrlParams(
        /\?.*filters=.*(?:%22priceRange%22|priceRange)/,
      );
    });
  });

  test.describe("Product Display and Interaction", () => {
    test("should display product cards", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Wait for products to load
      await shopPage.waitForProductsLoad();

      // Should have product cards
      const count = await shopPage.getProductCount();

      if (count > 0) {
        // Check first product card structure
        const firstCard = shopPage.productCards.first();
        await expect(firstCard).toBeVisible();

        // Should have image, title, and price
        await expect(
          firstCard.locator("img").or(firstCard.locator("📦")),
        ).toBeVisible();
        await expect(firstCard.locator("h3")).toBeVisible();
      }
    });

    test("should navigate to product page when clicked", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Wait for products to load
      await shopPage.waitForProductsLoad();

      const count = await shopPage.getProductCount();

      if (count > 0) {
        // Click first product
        await shopPage.clickFirstProduct();

        // Should navigate to product page
        await page.waitForURL(/\/product\/[^/]+/);
        await expect(page).toHaveURL(/\/product\/[^/]+/);
      }
    });

    test("should show product prices correctly", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.waitForProductsLoad();

      const count = await shopPage.getProductCount();

      if (count > 0) {
        // Check that prices are displayed (format may vary)
        const priceElements = shopPage.productPrices;
        if ((await priceElements.count()) > 0) {
          await expect(priceElements.first()).toBeVisible();
        }
      }
    });
  });

  test.describe("Pagination", () => {
    test("should display pagination when multiple pages exist", async ({
      page,
    }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Wait for content to load
      await shopPage.waitForProductsLoad();

      // Check if pagination exists
      const hasPagination = await shopPage.hasPagination();

      if (hasPagination) {
        // Test pagination controls
        await expect(shopPage.previousPageButton).toBeVisible();
        await expect(shopPage.nextPageButton).toBeVisible();
      }
    });

    test("should show products count", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.waitForProductsLoad();

      // Should show "Showing X of Y products"
      await expect(shopPage.productsCount).toBeVisible();
    });
  });

  test.describe("Empty States", () => {
    test("should handle no products found", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Search for something that doesn't exist
      await shopPage.searchInput.fill("nonexistentproduct123456");
      await page.waitForTimeout(600);

      // Should show empty state
      const hasEmptyState = await shopPage.hasEmptyState();

      if (hasEmptyState) {
        await expect(shopPage.emptyState).toBeVisible();
        await expect(
          page.getByText("Try adjusting your filters or search criteria"),
        ).toBeVisible();
      }
    });
  });

  test.describe("Reset Filters", () => {
    test("should reset all filters", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      // Apply some filters first
      await shopPage.searchInput.fill("test");

      await shopPage.minPriceInput.fill("50");
      await shopPage.applyPriceRangeButton.click();

      await page.waitForTimeout(600);

      // Check reset button appears
      if (await shopPage.resetButton.isVisible()) {
        await shopPage.resetFilters();

        // Should reset search and filters
        await expect(shopPage.searchInput).toHaveValue("");
        await expect(shopPage.minPriceInput).toHaveValue("0");
      }
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Search input should have aria-label
      await expect(shopPage.searchInput).toHaveAttribute(
        "aria-label",
        "Search products",
      );

      // Sort select should be keyboard accessible
      await expect(shopPage.sortSelect).toBeVisible();
    });

    test("should support keyboard navigation", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      // Focus the search input directly
      await shopPage.searchInput.focus();
      await expect(shopPage.searchInput).toBeFocused();

      // Tab to sort select
      await page.keyboard.press("Tab");
      await expect(shopPage.sortSelect).toBeFocused();
    });
  });

  test.describe("Loading States", () => {
    test("should show loading skeleton while fetching", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Should show loading state initially
      const hasLoading = await shopPage.hasLoadingSkeleton();

      if (hasLoading) {
        await expect(shopPage.loadingSkeleton).toBeVisible();

        // Should eventually load products
        await shopPage.waitForProductsLoad();
        await expect(shopPage.loadingSkeleton).not.toBeVisible();
      }
    });
  });

  test.describe("URL State Management", () => {
    test("should update URL with search parameters", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      // Apply search
      await shopPage.searchProducts("laptop");

      // URL should contain search parameter (match on encoded or unencoded filter param)
      await shopPage.waitForUrlParams(
        /\?.*filters=.*(?:%22search%22|search).*laptop/,
      );
    });

    test("should maintain filters in URL", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      // Apply price filter
      await shopPage.setPriceRange("25", "");

      await shopPage.waitForUrlParams(
        /\?.*filters=.*(?:%22priceRange%22|priceRange).*min.*25/,
      );
    });
  });
});
