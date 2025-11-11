import type { Page, Locator } from "@playwright/test";

export class ShopPage {
  readonly page: Page;

  // Page elements
  readonly mainContent: Locator;
  readonly productsGrid: Locator;
  readonly loadingSkeleton: Locator;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly filtersText: Locator;
  readonly categoriesText: Locator;
  readonly priceRangeText: Locator;
  readonly categoryButtons: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;
  readonly applyPriceRangeButton: Locator;
  readonly productCards: Locator;
  readonly productPrices: Locator;
  readonly pagination: Locator;
  readonly previousPageButton: Locator;
  readonly nextPageButton: Locator;
  readonly productsCount: Locator;
  readonly emptyState: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.mainContent = page.getByRole("main").filter({ hasText: /^$/ });
    this.productsGrid = page.getByTestId("products-grid");
    this.loadingSkeleton = page.getByTestId("products-loading-skeleton");
    this.searchInput = page.getByTestId("search-input");
    this.sortSelect = page.getByTestId("sort-select");
    this.filtersText = page.getByTestId("filters-heading");
    this.categoriesText = page.getByTestId("categories-heading");
    this.priceRangeText = page.getByTestId("price-range-heading");
    this.categoryButtons = page.locator('[data-testid^="category-button-"]');
    this.minPriceInput = page.getByTestId("min-price-input");
    this.maxPriceInput = page.getByTestId("max-price-input");
    this.applyPriceRangeButton = page.getByTestId("apply-price-range-button");
    this.productCards = page.getByTestId("product-card");
    this.productPrices = page.getByTestId("product-price");
    this.pagination = page.getByTestId("pagination-component");
    this.previousPageButton = page.getByTestId("previous-page-button");
    this.nextPageButton = page.getByTestId("next-page-button");
    this.productsCount = page.getByTestId("products-count");
    this.emptyState = page.getByTestId("empty-state");
    this.resetButton = page.getByTestId("reset-filters-button");
  }

  /**
   * Navigate to the shop page
   */
  async goto(): Promise<void> {
    await this.page.goto("/shop/all");
    await this.dismissToasts();
  }

  /**
   * Wait for filters to load (categories must be fetched)
   */
  async waitForFiltersLoad(timeout: number = 10000): Promise<void> {
    await this.page.waitForSelector('[data-testid="filters-sidebar"]', {
      timeout,
    });
  }

  /**
   * Wait for products area to load (either products, empty state, or loading to finish)
   */
  async waitForProductsLoad(timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(
      () => {
        // Check if products grid exists (products loaded)
        const productsGrid = document.querySelector(
          '[data-testid="products-grid"]',
        );
        if (productsGrid) return true;

        // Check if empty state exists (no products)
        const emptyState = document.querySelector(
          '[data-testid="empty-state"]',
        );
        if (emptyState) return true;

        // Check if loading skeleton still exists (still loading)
        const loadingSkeleton = document.querySelector(
          '[data-testid="products-loading-skeleton"]',
        );
        return !loadingSkeleton; // If no loading skeleton, we're done loading
      },
      { timeout },
    );
  }

  /**
   * Search for products
   */
  async searchProducts(query: string): Promise<void> {
    await this.searchInput.fill(query);
    // Wait for debounced search (500ms delay)
    await this.page.waitForTimeout(600);
  }

  /**
   * Clear search input
   */
  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    // Wait for debounced search
    await this.page.waitForTimeout(600);
  }

  /**
   * Select sort option
   */
  async selectSortOption(optionText: string): Promise<void> {
    await this.sortSelect.click();
    await this.page.getByText(optionText).click();
  }

  /**
   * Get all available sort options
   */
  async getSortOptions(): Promise<string[]> {
    await this.sortSelect.click();
    const options = await this.page
      .locator('[role="option"]')
      .allTextContents();
    // Close dropdown
    await this.page.keyboard.press("Escape");
    return options;
  }

  /**
   * Click first available category
   */
  async clickFirstCategory(): Promise<void> {
    await this.dismissToasts();
    const firstCategory = this.categoryButtons.first();
    await firstCategory.click();
  }

  /**
   * Get first category name
   */
  async getFirstCategoryName(): Promise<string> {
    const firstCategory = this.categoryButtons.first();
    return (await firstCategory.textContent()) || "";
  }

  /**
   * Set price range
   */
  async setPriceRange(min: string, max: string): Promise<void> {
    await this.minPriceInput.fill(min);
    await this.maxPriceInput.fill(max);
    await this.applyPriceRangeButton.click();
  }

  /**
   * Click first product card
   */
  async clickFirstProduct(): Promise<void> {
    await this.productCards.first().click();
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    return await this.productCards.count();
  }

  /**
   * Reset all filters
   */
  async resetFilters(): Promise<void> {
    if (await this.resetButton.isVisible()) {
      await this.resetButton.click();
    }
  }

  /**
   * Wait for URL to contain specific parameters
   */
  async waitForUrlParams(
    params: RegExp,
    timeout: number = 10000,
  ): Promise<void> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentUrl = this.page.url();
      if (params.test(currentUrl)) {
        return;
      }
      await this.page.waitForTimeout(100);
    }
    throw new Error(
      `URL did not match pattern ${params} within ${timeout}ms. Current URL: ${this.page.url()}`,
    );
  }

  /**
   * Check if pagination exists
   */
  async hasPagination(): Promise<boolean> {
    try {
      return await this.pagination.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if empty state is visible
   */
  async hasEmptyState(): Promise<boolean> {
    try {
      return await this.emptyState.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if loading skeleton is visible
   */
  async hasLoadingSkeleton(): Promise<boolean> {
    try {
      return await this.loadingSkeleton.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Set viewport for desktop testing
   */
  async setDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1024, height: 768 });
  }

  /**
   * Set viewport for mobile testing
   */
  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }

  /**
   * Check if page is loaded successfully
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState("networkidle");
      return await this.mainContent.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Dismiss any visible toast notifications
   */
  async dismissToasts(): Promise<void> {
    // Wait a bit for toasts to appear
    await this.page.waitForTimeout(500);

    // Try multiple strategies to dismiss toasts
    const strategies = [
      // Strategy 1: Click dismissible toast close buttons
      async () => {
        const toastCloseButtons = this.page.locator(
          '[data-sonner-toast][data-dismissible="true"]',
        );
        const count = await toastCloseButtons.count();
        for (let i = 0; i < count; i++) {
          try {
            await toastCloseButtons.nth(i).click({ force: true });
            await this.page.waitForTimeout(100);
          } catch {
            // Continue if click fails
          }
        }
      },
      // Strategy 2: Press Escape key
      async () => {
        await this.page.keyboard.press("Escape");
        await this.page.waitForTimeout(200);
      },
      // Strategy 3: Click on the toast itself if it's dismissible
      async () => {
        const toasts = this.page.locator("[data-sonner-toast]");
        const count = await toasts.count();
        for (let i = 0; i < count; i++) {
          try {
            await toasts.nth(i).click({ force: true });
            await this.page.waitForTimeout(100);
          } catch {
            // Continue if click fails
          }
        }
      },
    ];

    // Execute all strategies
    for (const strategy of strategies) {
      await strategy();
    }

    // Final wait to ensure toasts are gone
    await this.page.waitForTimeout(500);
  }
}
