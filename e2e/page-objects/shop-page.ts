import type { Page, Locator } from "@playwright/test";

export class ShopPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly filtersHeading: Locator;
  readonly categoriesHeading: Locator;
  readonly priceRangeHeading: Locator;
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
  readonly productsGrid: Locator;
  readonly emptyState: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId("search-input");
    this.sortSelect = page.getByTestId("sort-select");
    this.filtersHeading = page.getByTestId("filters-heading");
    this.categoriesHeading = page.getByTestId("categories-heading");
    this.priceRangeHeading = page.getByTestId("price-range-heading");
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
    this.productsGrid = page.getByTestId("products-grid");
    this.emptyState = page.getByTestId("empty-state");
    this.resetButton = page.getByTestId("reset-filters-button");
  }

  async goto(): Promise<void> {
    await this.page.goto("/shop/all");

    // Dismiss welcome toast by setting the cookie
    await this.page.evaluate(() => {
      document.cookie = "welcome-toast=2; max-age=31536000; path=/";
    });
  }

  async searchProducts(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(600);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.clear();
    await this.page.waitForTimeout(600);
  }

  async selectSortOption(optionText: string): Promise<void> {
    await this.sortSelect.click();
    await this.page.getByText(optionText, { exact: true }).click();
  }

  async setPriceRange(min: string, max: string): Promise<void> {
    if (min) await this.minPriceInput.fill(min);
    if (max) await this.maxPriceInput.fill(max);
    await this.applyPriceRangeButton.click();
    await this.page.waitForTimeout(300);
  }

  async clickFirstProduct(): Promise<void> {
    await this.productCards.first().click();
  }

  async resetFilters(): Promise<void> {
    await this.resetButton.click();
    await this.page.waitForTimeout(300);
  }

  async setDesktopViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 1280, height: 720 });
  }

  async setMobileViewport(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
  }
}
