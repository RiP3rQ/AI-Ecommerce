# E2E Tests

This directory contains end-to-end tests for the AI Ecommerce application using Playwright.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Install Playwright browsers:
   ```bash
   pnpm exec playwright install
   ```

## Running Tests

### Run all E2E tests
```bash
pnpm run test:e2e
```

### Run tests with UI mode (interactive)
```bash
pnpm run test:e2e:ui
```

### Run specific test file
```bash
pnpm exec playwright test login.spec.ts
```

### Run tests in specific browser
```bash
pnpm exec playwright test --project=chromium
```

### Run tests with debugging
```bash
pnpm exec playwright test --debug
```

## Test Structure

### Authentication Helpers (`auth-helpers.ts`)

Utility functions for handling authentication in tests:

- **`authenticateUser(page)`**: Logs in with test credentials
- **`isAuthenticated(page)`**: Checks if user is currently authenticated
- **`ensureAuthenticated(page)`**: Authenticates only if not already logged in

### Login Tests (`login.spec.ts`)

Comprehensive test suite covering all login page functionality:

- **Page Loading & UI Elements**
  - Page loads successfully
  - All form elements are present
  - Responsive design (desktop/mobile)

- **Form Validation**
  - Empty field validation
  - Email format validation

- **Authentication Flows**
  - Successful login with valid credentials (`test@test.com` / `password123`)
  - Failed login with invalid credentials
  - Loading states during authentication

- **User Interactions**
  - Form submission with Enter key
  - Error message clearing on user input
  - Form disabling during submission

- **Navigation**
  - Links to forgot password page
  - Links to sign up page

- **Accessibility**
  - Proper ARIA labels
  - Keyboard navigation support
  - Screen reader compatibility

- **Loading States**
  - Loading indicators during authentication
  - State reset after failed login

- **Error Handling**
  - Clear error message display
  - Proper error styling

- **Google Authentication**
  - Google login button presence

### Shop Tests (`shop.spec.ts`)

Comprehensive test suite covering all shop page functionality. **Note**: All shop tests automatically authenticate using test credentials before running, since the application routes are protected.

- **Page Loading & UI Elements**
  - Shop page loads successfully after authentication
  - Search and sort controls are displayed
  - Filters sidebar shows on desktop, hidden on mobile

- **Search Functionality**
  - Search input accepts text input
  - Debounced search (500ms delay) works correctly
  - Search results update appropriately
  - Search clearing works

- **Sort Functionality**
  - Sort dropdown shows all options (Newest First, Oldest First, Name A-Z, Name Z-A, Price Low-High, Price High-Low)
  - Sort changes update URL and results
  - Default sort behavior

- **Category Filtering**
  - Category buttons are displayed
  - Clicking category filters results
  - URL updates with category parameters

- **Price Range Filtering**
  - Price range inputs are present
  - Price range application works
  - Active filters display correctly

- **Product Display & Interaction**
  - Product cards show with images, titles, descriptions, prices
  - Product cards are clickable and navigate to product pages
  - Product count displays correctly
  - Out of stock products show badges

- **Pagination**
  - Pagination controls appear when multiple pages exist
  - Page navigation works
  - Previous/Next buttons function correctly

- **Empty States**
  - "No products found" message displays for empty results
  - Appropriate messaging for filters

- **Reset Filters**
  - Reset button appears when filters are active
  - Reset clears all filters and search

- **Accessibility**
  - Proper ARIA labels on form elements
  - Keyboard navigation support
  - Screen reader compatibility

- **Loading States**
  - Loading skeletons display during data fetching
  - Loading states transition to content properly

- **URL State Management**
  - URL parameters update with search, filters, and sort
  - URL state persistence works correctly

## Test Credentials

For authentication tests, use these credentials:
- **Email**: `test@test.com`
- **Password**: `password123`

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:3000`
- Automatic dev server startup
- Tests run in Chromium, Firefox, and WebKit
- Parallel execution enabled
- HTML reports generated

## CI/CD

Tests run automatically on:
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches

Reports are uploaded as artifacts and retained for 30 days.
