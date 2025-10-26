import { expect, Page } from "@playwright/test";

const TEST_EMAIL = "test@test.com";
const TEST_PASSWORD = "password123";

/**
 * Authenticates a user by logging in with test credentials
 * @param page - Playwright page instance
 */
export async function authenticateUser(page: Page): Promise<void> {
  // Navigate to login page
  await page.goto("/auth/login");

  // Fill login form
  const emailInput = page.getByTestId("email-input");
  const passwordInput = page.getByTestId("password-input");
  const submitButton = page.getByTestId("login-button");

  await emailInput.fill(TEST_EMAIL);
  await passwordInput.fill(TEST_PASSWORD);

  // Submit form
  await submitButton.click();

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
