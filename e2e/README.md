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
