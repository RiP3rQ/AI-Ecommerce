import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  // Page elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly googleButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;
  readonly loginImage: Locator;
  readonly errorMessage: Locator;
  readonly welcomeHeading: Locator;

  constructor(page: Page) {
    this.page = page;

    // Initialize locators
    this.emailInput = page.getByTestId("email-input");
    this.passwordInput = page.getByTestId("password-input");
    this.loginButton = page.getByTestId("login-button");
    this.googleButton = page.getByRole("button", {
      name: "Continue with Google",
    });
    this.forgotPasswordLink = page.getByRole("link", {
      name: "Forgot your password?",
    });
    this.signUpLink = page.getByRole("link", { name: "Sign up" });
    this.loginImage = page.getByAltText("Ecommerce Login Page");
    this.errorMessage = page.getByTestId("error-message");
    this.welcomeHeading = page.getByRole("heading", { name: "Welcome back" });
  }

  /**
   * Navigate to the login page
   */
  async goto(): Promise<void> {
    await this.page.goto("/auth/login");
  }

  /**
   * Fill the login form with email and password
   */
  async fillLoginForm(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  /**
   * Submit login form with Enter key from password field
   */
  async submitWithEnter(): Promise<void> {
    await this.passwordInput.press("Enter");
  }

  /**
   * Perform complete login flow
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillLoginForm(email, password);
    await this.clickLogin();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click sign up link
   */
  async clickSignUp(): Promise<void> {
    await this.signUpLink.click();
  }

  /**
   * Wait for loading state to appear
   */
  async waitForLoadingState(): Promise<void> {
    await this.page.waitForFunction(() => {
      const button = document.querySelector('[data-testid="login-button"]');
      return (
        button &&
        (button.textContent?.includes("Logging in...") ||
          button.textContent?.includes("Login"))
      );
    });
  }

  /**
   * Wait for error message to appear
   */
  async waitForErrorMessage(): Promise<void> {
    await this.errorMessage.waitFor({ state: "visible", timeout: 10000 });
  }

  /**
   * Check if form is disabled during submission
   */
  async isFormDisabled(): Promise<boolean> {
    try {
      await this.emailInput.waitFor({ state: "attached", timeout: 5000 });
      return await this.emailInput.isDisabled();
    } catch {
      return false;
    }
  }

  /**
   * Get the current login button text
   */
  async getLoginButtonText(): Promise<string> {
    return (await this.loginButton.textContent()) || "";
  }

  /**
   * Check if page is loaded successfully
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForLoadState("networkidle");
      return await this.welcomeHeading.isVisible();
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
}
