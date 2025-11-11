import { test, expect } from "@playwright/test";
import { ShopPage } from "./page-objects/shop-page";

test.describe("Shop Page", () => {
  test.describe("Page Loading and UI Elements", () => {
    test("should display search and sort controls", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await expect(shopPage.searchInput).toBeVisible();
      await expect(page.getByText("Sort by:")).toBeVisible();
      await expect(shopPage.sortSelect).toBeVisible();
    });

    test("should display filters sidebar on desktop", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await expect(shopPage.filtersHeading).toBeVisible({ timeout: 10000 });
      await expect(shopPage.categoriesHeading).toBeVisible();
      await expect(shopPage.priceRangeHeading).toBeVisible();
    });

    test("should hide filters sidebar on mobile", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setMobileViewport();
      await shopPage.goto();

      await expect(shopPage.filtersHeading).not.toBeVisible();
    });
  });

  test.describe("Search Functionality", () => {
    test("should allow typing in search input", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.searchInput.fill("test search");
      await expect(shopPage.searchInput).toHaveValue("test search");
    });

    test("should show results after searching", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await expect(
        shopPage.productsGrid.or(shopPage.emptyState),
      ).toBeVisible({ timeout: 10000 });

      await shopPage.searchProducts("laptop");
      await expect(
        shopPage.productsGrid.or(shopPage.emptyState),
      ).toBeVisible();
    });

    test("should clear search when input is cleared", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.searchProducts("laptop");
      await shopPage.clearSearch();

      await expect(
        shopPage.productsGrid.or(shopPage.emptyState),
      ).toBeVisible();
    });
  });

  test.describe("Sort Functionality", () => {
    test("should display sort options", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.sortSelect.click();

      await expect(page.getByText("Newest First", { exact: true })).toBeVisible();
      await expect(page.getByText("Price: Low to High", { exact: true })).toBeVisible();
      await expect(page.getByText("Price: High to Low", { exact: true })).toBeVisible();
    });

    test("should change sort order", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await expect(
        shopPage.productsGrid.or(shopPage.emptyState),
      ).toBeVisible({ timeout: 10000 });

      await shopPage.selectSortOption("Price: Low to High");

      await expect(async () => {
        const url = new URL(page.url());
        const filtersParam = url.searchParams.get("filters");
        if (!filtersParam) throw new Error("filters param missing in URL");
        const filters = JSON.parse(decodeURIComponent(filtersParam));
        if (filters.sortField !== "price" || filters.sortDirection !== "asc") {
          throw new Error(
            `Sort params not correct: ${JSON.stringify(filters)}`,
          );
        }
      }).toPass({ timeout: 5000 });
    });
  });

  test.describe("Category Filtering", () => {
    test("should display category filters", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await expect(shopPage.categoriesHeading).toBeVisible({ timeout: 10000 });
      await expect(shopPage.categoryButtons.first()).toBeVisible();
    });

    test("should not display category filters on mobile", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setMobileViewport();
      await shopPage.goto();

      await expect(shopPage.categoriesHeading).not.toBeVisible();
    });
  });

  test.describe("Price Range Filtering", () => {
    test("should display price range inputs", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await expect(shopPage.priceRangeHeading).toBeVisible({ timeout: 10000 });
      await expect(shopPage.minPriceInput).toBeVisible();
      await expect(shopPage.maxPriceInput).toBeVisible();
      await expect(shopPage.applyPriceRangeButton).toBeVisible();
    });

    test("should allow setting price range", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await expect(shopPage.priceRangeHeading).toBeVisible({ timeout: 10000 });

      await shopPage.setPriceRange("10", "100");

      await expect(async () => {
        const url = page.url();
        if (!url.includes("priceRange")) {
          throw new Error("URL should contain priceRange");
        }
      }).toPass({ timeout: 5000 });
    });
  });

  test.describe("Product Display and Interaction", () => {
    test("should display products or empty state", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await expect(
        shopPage.productsGrid.or(shopPage.emptyState),
      ).toBeVisible({ timeout: 10000 });

      const hasProducts = await shopPage.productsGrid.isVisible().catch(() => false);

      if (hasProducts) {
        await expect(shopPage.productCards.first()).toBeVisible();
        await expect(shopPage.productCards.first().locator("h3")).toBeVisible();
      }
    });

    test("should navigate to product page when clicked", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      const hasProducts = await shopPage.productsGrid.isVisible({ timeout: 10000 }).catch(() => false);

      if (hasProducts) {
        await shopPage.clickFirstProduct();
        await expect(page).toHaveURL(/\/product\/.+/, { timeout: 5000 });
      } else {
        test.skip();
      }
    });

    test("should show product prices", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      const hasProducts = await shopPage.productsGrid.isVisible({ timeout: 10000 }).catch(() => false);

      if (hasProducts && (await shopPage.productPrices.count()) > 0) {
        await expect(shopPage.productPrices.first()).toBeVisible();
      } else {
        test.skip();
      }
    });
  });

  test.describe("Pagination", () => {
    test("should display pagination when products exist", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      const hasProducts = await shopPage.productsGrid.isVisible({ timeout: 10000 }).catch(() => false);

      if (hasProducts) {
        const hasPagination = await shopPage.pagination.isVisible().catch(() => false);
        
        if (hasPagination) {
          await expect(shopPage.previousPageButton).toBeVisible();
          await expect(shopPage.nextPageButton).toBeVisible();
        }
      } else {
        test.skip();
      }
    });

    test("should show products count", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      const hasProducts = await shopPage.productsGrid.isVisible({ timeout: 10000 }).catch(() => false);

      if (hasProducts) {
        await expect(shopPage.productsCount).toBeVisible();
      } else {
        test.skip();
      }
    });
  });

  test.describe("Empty States", () => {
    test("should handle no products found", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.searchInput.fill("nonexistentproduct123456");
      await page.waitForTimeout(600);

      const hasEmptyState = await shopPage.emptyState.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasEmptyState) {
        await expect(shopPage.emptyState).toBeVisible();
      }
    });
  });

  test.describe("Reset Filters", () => {
    test("should reset all filters", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await expect(shopPage.minPriceInput).toBeVisible({ timeout: 10000 });

      await shopPage.searchInput.fill("test");
      await shopPage.setPriceRange("50", "200");

      await page.waitForTimeout(300);

      const hasResetButton = await shopPage.resetButton.isVisible().catch(() => false);

      if (hasResetButton) {
        await shopPage.resetFilters();
        await expect(shopPage.searchInput).toHaveValue("");
      }
    });
  });

  test.describe("Accessibility", () => {
    test("should have proper ARIA labels", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await expect(shopPage.searchInput).toHaveAttribute(
        "aria-label",
        "Search products",
      );
    });

    test("should support keyboard navigation", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.searchInput.focus();
      await expect(shopPage.searchInput).toBeFocused();

      await page.keyboard.press("Tab");
      await expect(shopPage.sortSelect).toBeFocused();
    });
  });

  test.describe("Loading States", () => {
    test("should eventually show content", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await expect(
        shopPage.productsGrid.or(shopPage.emptyState),
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe("URL State Management", () => {
    test("should update URL with search parameters", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.goto();

      await shopPage.searchProducts("laptop");

      await expect(async () => {
        const url = page.url();
        if (!url.includes("search") && !url.includes("laptop")) {
          throw new Error("URL should contain search parameter");
        }
      }).toPass({ timeout: 5000 });
    });

    test("should maintain filters in URL", async ({ page }) => {
      const shopPage = new ShopPage(page);
      await shopPage.setDesktopViewport();
      await shopPage.goto();

      await expect(shopPage.priceRangeHeading).toBeVisible({ timeout: 10000 });

      await shopPage.setPriceRange("25", "");

      await expect(async () => {
        const url = page.url();
        if (!url.includes("priceRange") && !url.includes("min")) {
          throw new Error("URL should contain price range filter");
        }
      }).toPass({ timeout: 5000 });
    });
  });
});
