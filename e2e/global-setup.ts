import { chromium } from "@playwright/test";

// This will run before all tests
async function globalSetup() {
  // Inject a global variable to indicate we're in test mode
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Navigate to the app and inject the test indicator
  await page.goto("http://localhost:3000");
  await page.addScriptTag({
    content: "window.__IS_PLAYWRIGHT_TEST__ = true;",
  });

  await browser.close();
}

export default globalSetup;
