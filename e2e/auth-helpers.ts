import { expect, type Page } from "@playwright/test";
import { LoginPage } from "./page-objects/login-page";

const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "password123";

/**
 * Authenticates a user by logging in with test credentials
 * @param page - Playwright page instance
 */
export async function authenticateUser(page: Page): Promise<void> {
  const loginPage = new LoginPage(page);

  // Navigate to login page and login
  await loginPage.goto();
  await loginPage.login(TEST_EMAIL, TEST_PASSWORD);

  // Wait for successful login (redirect to home page)
  await page.waitForURL("/", { timeout: 10000 });

  // Verify we're logged in
  await expect(page).toHaveURL("/");
}

/**
 * Checks if user is already authenticated by trying to access a protected route
 * @param page - Playwright page instance
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Try to access a protected route
    await page.goto("/shop/all");
    await page.waitForURL(/^(?!.*\/auth\/login).*$/, { timeout: 5000 });
    return page.url().includes("/shop/all");
  } catch {
    return false;
  }
}

/**
 * Ensures user is authenticated, logging in if necessary
 * @param page - Playwright page instance
 */
export async function ensureAuthenticated(page: Page): Promise<void> {
  const authenticated = await isAuthenticated(page);
  if (!authenticated) {
    await authenticateUser(page);
  }
}
