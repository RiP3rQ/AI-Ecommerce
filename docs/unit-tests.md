# Unit Testing Setup

This document describes the testing setup for the AI Ecommerce backend, including unit tests and integration tests using Vitest, Supabase auth mocking, and database testing utilities.

## Overview

The testing framework is built with:
- **Vitest** - Fast unit testing framework with Jest-compatible API
- **Supabase Auth Mocking** - Prevents actual API calls during tests
- **Database Transaction Testing** - Isolated database tests with automatic rollback
- **Test Fixtures** - Sample data for consistent testing scenarios

## Project Structure

```
src/
├── test/
│   ├── setup/
│   │   ├── global-setup.ts    # Database initialization and cleanup
│   │   └── test-setup.ts      # Mocks and per-test setup
│   ├── utils/
│   │   └── db-helper.ts       # Database testing utilities
│   └── fixtures/              # Sample test data
│       ├── categories.ts
│       ├── products.ts
│       ├── profiles.ts
│       └── index.ts
```

## Test Configuration

### Vitest Configuration (`vitest.config.mts`)

The Vitest configuration includes:
- **Global Setup**: Runs database migrations and cleanup before all tests
- **Test Setup**: Mocks Supabase auth and other external dependencies
- **Serial Execution**: Tests run serially to avoid database conflicts
- **Coverage**: 80% coverage threshold across branches, functions, lines, and statements

```typescript
export default defineConfig({
  test: {
    globalSetup: ["./src/test/setup/global-setup.ts"],
    setupFiles: ["./src/test/setup/test-setup.ts"],
    environment: "node",
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true, // Avoid database race conditions
      },
    },
  },
});
```

## Database Testing

### Global Setup (`src/test/setup/global-setup.ts`)

The global setup:
1. Ensures we're in test environment
2. Runs database migrations to ensure schema is up-to-date
3. Truncates all tables to provide a clean state
4. Cleans up after all tests complete

### Database Helpers (`src/test/utils/db-helper.ts`)

Provides utilities for database testing:

```typescript
import { createTestableUnit, dbHelpers } from "@/test/utils/db-helper";

// Test with automatic transaction rollback
await createTestableUnit(async (db) => {
  // Your test logic here
  // Transaction automatically rolls back
});

// Create test data
const category = await dbHelpers.createTestCategory(db, {
  name: "Electronics",
  description: "Electronic devices",
});

const product = await dbHelpers.createTestProduct(db, {
  title: "Test Product",
  categoryId: category.id,
});

// Clean all tables
await dbHelpers.truncateAllTables(db);
```

## Supabase Auth Mocking

### Test Setup (`src/test/setup/test-setup.ts`)

The test setup mocks all Supabase auth functions to prevent actual API calls:

```typescript
import { mockAuthenticatedUser, mockUnauthenticatedUser } from "@/test/setup/test-setup";

// Mock authenticated user
mockAuthenticatedUser({
  id: "user-123",
  email: "test@example.com",
});

// Mock unauthenticated state
mockUnauthenticatedUser();

// Access mocked Supabase client
import { createServerSupabaseClient } from "@/supabase-auth/server";
const supabase = createServerSupabaseClient(); // Returns mocked client
```

### Available Mock Helpers

- `mockAuthenticatedUser(user)` - Mock a logged-in user
- `mockUnauthenticatedUser()` - Mock no authenticated user
- `mockAuthError(error)` - Mock authentication errors

## Test Fixtures

### Sample Data (`src/test/fixtures/`)

Pre-defined sample data for consistent testing:

```typescript
import { categoryFixtures, getCategoryFixture } from "@/test/fixtures";

// Use predefined fixtures
const electronics = getCategoryFixture("Electronics");

// Or access all fixtures
const allCategories = categoryFixtures;
```

Available fixtures:
- **Categories**: Electronics, Clothing, Home & Garden, Books, Sports & Outdoors
- **Products**: Sample products with various states (available, out of stock)
- **Profiles**: User profiles with different policy acceptance states

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from "vitest";
import { createTestableUnit } from "@/test/utils/db-helper";
import { shopService } from "@/app/api/shop/service";

describe("ShopService", () => {
  describe("getProducts", () => {
    it("should return products with pagination", async () => {
      await createTestableUnit(async (db) => {
        // Setup test data
        const category = await dbHelpers.createTestCategory(db, {
          name: "Test Category",
        });

        await dbHelpers.createTestProduct(db, {
          title: "Test Product",
          categoryId: category.id,
        });

        // Test the service
        const result = await shopService.getProducts({
          dto: { page: 1, limit: 10 },
        });

        expect(result.products).toHaveLength(1);
        expect(result.pagination.totalItems).toBe(1);
      });
    });
  });
});
```

### Testing Authenticated Endpoints

```typescript
import { mockAuthenticatedUser } from "@/test/setup/test-setup";

describe("Authenticated Endpoint", () => {
  it("should work for authenticated users", async () => {
    // Mock authenticated user
    mockAuthenticatedUser({
      id: "user-123",
      email: "test@example.com",
    });

    await createTestableUnit(async (db) => {
      // Create user profile in database
      await dbHelpers.createTestProfile(db, {
        id: "user-123",
        acceptedDataPolicy: true,
      });

      // Test your authenticated endpoint
      // ...
    });
  });
});
```

### Testing API Routes

```typescript
import { NextRequest } from "next/server";

describe("API Routes", () => {
  it("should handle GET requests", async () => {
    const req = new NextRequest("http://localhost:3000/api/categories");

    // Mock authenticated user if needed
    mockAuthenticatedUser({ id: "user-123" });

    await createTestableUnit(async (db) => {
      // Setup test data
      await dbHelpers.createTestCategory(db, {
        name: "Test Category",
      });

      // Import and test the route handler
      const { GET } = await import("@/app/api/categories/route");
      const response = await GET(req);

      expect(response.status).toBe(200);
      // ... additional assertions
    });
  });
});
```

## Running Tests

### Commands

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test shop.service.test.ts

# Run tests matching pattern
pnpm test -t "should return products"
```

### Environment Setup

Tests require:
1. **Database**: A PostgreSQL database for testing
2. **Environment Variables**: Same as production, but for test database
3. **Test Environment**: `NODE_ENV=test`

Create a `.env.test` file with test-specific environment variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/test_db"
NODE_ENV=test
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-test-key"
```

## Best Practices

### 1. Use Testable Units
Always wrap database tests in `createTestableUnit` to ensure isolation:

```typescript
// ✅ Good
await createTestableUnit(async (db) => {
  // Test logic
});

// ❌ Bad - No isolation
const db = createTestDb();
// Test logic without transaction
```

### 2. Mock External Dependencies
Never make real API calls in tests:

```typescript
// ✅ Good
mockAuthenticatedUser({ id: "user-123" });

// ❌ Bad
// Actual Supabase API call
```

### 3. Use Fixtures for Consistency
Use predefined fixtures for reliable test data:

```typescript
// ✅ Good
const category = getCategoryFixture("Electronics");

// ❌ Bad
const category = await dbHelpers.createTestCategory(db, {
  name: "Electronics",
  description: "Random description",
});
```

### 4. Test Edge Cases
Cover both happy path and error scenarios:

```typescript
describe("getProducts", () => {
  it("should return products when available", async () => {
    // Happy path test
  });

  it("should return empty array when no products exist", async () => {
    // Edge case test
  });

  it("should throw error for invalid category", async () => {
    // Error case test
  });
});
```

### 5. Clean Test Descriptions
Write descriptive test names:

```typescript
// ✅ Good
it("should return paginated products with correct metadata", async () => {
  // Test implementation
});

// ❌ Bad
it("should work", async () => {
  // Test implementation
});
```

### 6. Group Related Tests
Use `describe` blocks to organize tests:

```typescript
describe("ShopService", () => {
  describe("getProducts", () => {
    describe("filtering", () => {
      it("should filter by category", async () => {
        // Test implementation
      });
    });
  });
});
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database is running
   - Check `DATABASE_URL` in `.env.test`

2. **Migration Errors**
   - Ensure migrations are up-to-date
   - Check database permissions

3. **Mock Not Working**
   - Ensure mocks are reset between tests
   - Check import order (mocks must be imported before tested code)

4. **Test Timeouts**
   - Increase `testTimeout` in config for slow operations
   - Check for infinite loops or hanging promises

### Debugging Tips

- Use `console.log` in test setup to debug mock state
- Use Vitest's `--reporter=verbose` for detailed output
- Use `vi.spyOn` to spy on function calls
- Use `vi.mocked` to access mocked function calls

## Coverage Requirements

The project maintains 80% coverage across:
- **Branches**: Decision points in code
- **Functions**: All exported functions
- **Lines**: Executable lines of code
- **Statements**: All statements

Coverage reports are generated in `coverage/` directory with HTML, JSON, and text formats.

## Performance Optimization Guide

This guide outlines best practices for writing efficient unit tests that leverage the optimized Vitest setup.

### Key Performance Improvements

Our Vitest setup has been optimized for speed:

1. **Connection Pooling**: Single shared pool reuses connections (vs creating new ones)
2. **Batched Truncation**: Related tables truncated in parallel (3-4x faster)
3. **Transaction Isolation**: Automatic rollback eliminates manual cleanup
4. **Reduced Threading**: 4 threads optimal for database-bound work (vs 8)
5. **Selective Mocking**: Mocks initialized once per file, not per test
6. **Lazy Migrations**: Runs only once per session, not per test run

### Expected Performance Gains

- **Global Setup**: ~500-1000ms → ~50-100ms (10x faster)
- **Per-Test Overhead**: ~50-100ms → ~5-10ms (10x faster)
- **Database Truncation**: ~200ms → ~50ms (4x faster)
- **Overall Suite**: Estimated **40-50% reduction** in total test execution time

---

## Best Practices for Test Performance

### 1. Use `createTestableUnit` for Automatic Isolation

✅ **DO:**
```typescript
it("should add item to cart", async () => {
  await createTestableUnit(async (db) => {
    const profile = await createProfileFixture({ db });
    const cart = await cartService.getOrCreateCart({ 
      userId: profile.id, 
      db 
    });
    expect(cart).toBeDefined();
  });
});
```

❌ **DON'T:**
```typescript
it("should add item to cart", async () => {
  const profile = await createProfileFixture({ db: testDb });
  // Manual cleanup required!
  await testDb.delete(profiles).where(eq(profiles.id, profile.id));
});
```

**Why**: Automatic rollback is ~10x faster than manual cleanup and prevents test pollution.

---

### 2. Use Specific Table Truncation

✅ **DO:**
```typescript
describe("/api/cart", () => {
  beforeEach(async () => {
    // Only truncate cart tables
    await dbHelpers.truncateCartTables();
  });
  // ... tests
});
```

❌ **DON'T:**
```typescript
describe("/api/cart", () => {
  beforeEach(async () => {
    // Truncates everything - 4x slower!
    await dbHelpers.truncateAllTables();
  });
});
```

**Why**: Truncating only needed tables is 3-4x faster.

---

### 3. Batch Database Operations

✅ **DO:**
```typescript
// Create multiple fixtures efficiently
const [profile, category, product] = await Promise.all([
  createProfileFixture({ db }),
  createCategoryFixture({ db }),
  createProductFixture({ db }),
]);
```

❌ **DON'T:**
```typescript
// Sequential operations are much slower
const profile = await createProfileFixture({ db });
const category = await createCategoryFixture({ db });
const product = await createProductFixture({ db });
```

**Why**: Parallel operations reduce total execution time significantly.

---

### 4. Group Related Tests by Table

✅ **DO:**
```typescript
describe("/api/cart", () => {
  beforeAll(() => dbHelpers.truncateCartTables());
  beforeEach(() => dbHelpers.truncateCartTables());

  describe("CartService", () => {
    it("gets or creates cart", async () => { /* ... */ });
    it("adds item to cart", async () => { /* ... */ });
  });
});

describe("/api/categories", () => {
  beforeAll(() => dbHelpers.truncateCategoriesTable());
  beforeEach(() => dbHelpers.truncateCategoriesTable());

  describe("CategoriesService", () => {
    it("lists categories", async () => { /* ... */ });
  });
});
```

❌ **DON'T:**
```typescript
// Mixed test files truncate everything
describe("All Tests", () => {
  beforeEach(() => dbHelpers.truncateAllTables());
  // Cart tests, category tests, product tests all mixed
});
```

**Why**: Table-specific truncation is much faster and reduces contention.

---

### 5. Mock Only What You Need

✅ **DO:**
```typescript
it("should validate user session", async () => {
  mockAuthenticatedApiUser({ id: "user-123" });
  // Only mock auth when needed for this test
  
  const result = await getUserCart("user-123");
  expect(result).toBeDefined();
});
```

❌ **DON'T:**
```typescript
beforeEach(() => {
  // Unnecessarily mocking all auth methods for every test
  mockAuthenticatedApiUser();
  mockUnauthenticatedApiUser();
  mockAuthError({ message: "test" });
});
```

**Why**: Selective mocking reduces setup overhead.

---

### 6. Use Fixtures for Reusable Test Data

✅ **DO:**
```typescript
// In fixtures/products.ts
export async function createProductFixture(options: Options) {
  const defaults = {
    title: faker.commerce.productName(),
    categoryId: faker.string.uuid(),
  };
  return createTestProduct({ ...defaults, ...options });
}

// In tests
const product = await createProductFixture({
  db,
  overrides: { title: "Custom Product" }
});
```

❌ **DON'T:**
```typescript
// Repeating setup in every test
it("test 1", async () => {
  const product = await db.insert(products).values({
    id: faker.string.uuid(),
    title: faker.commerce.productName(),
    // ... 10 more fields
  });
});
```

**Why**: Fixtures reduce duplication and make tests more readable.

---

### 7. Organize Tests by Feature

✅ **DO:**
```
src/app/api/cart/
├── cart.test.ts          (all cart tests)
├── route.ts
├── service.ts
└── dto.ts

src/app/api/categories/
├── categories.test.ts    (all category tests)
├── route.ts
├── service.ts
└── dto.ts
```

❌ **DON'T:**
```
src/app/api/
├── tests.ts              (all tests mixed)
├── cart/
├── categories/
└── products/
```

**Why**: Feature-grouped tests allow targeted table truncation and faster parallel execution.

---

### 8. Avoid Sleep and Hard Timeouts

✅ **DO:**
```typescript
it("should process cart checkout", async () => {
  await createTestableUnit(async (db) => {
    // Wait for actual condition, not arbitrary time
    const cart = await cartService.getCart({ userId, db });
    expect(cart.items.length).toBeGreaterThan(0);
  });
});
```

❌ **DON'T:**
```typescript
it("should process cart checkout", async () => {
  await sleep(1000); // Wastes time!
  const cart = await cartService.getCart({ userId });
  expect(cart).toBeDefined();
});
```

**Why**: Hard timeouts waste test execution time and make tests flaky.

---

### 9. Use Test Transaction Isolation

✅ **DO:**
```typescript
// Tests are automatically isolated via transactions
it("test A", async () => {
  await createTestableUnit(async (db) => {
    await cartService.addItem({ userId: "user-1", db });
    // Auto-rollback after test
  });
});

it("test B", async () => {
  await createTestableUnit(async (db) => {
    // Starts fresh - no interference from test A
    const cart = await cartService.getCart({ userId: "user-1", db });
    expect(cart.items).toHaveLength(0);
  });
});
```

**Why**: Transactions guarantee isolation without manual cleanup.

---

### 10. Profile Test Performance

Monitor test execution time:

```bash
# Run with verbose timing
npm run test

# Run specific test file with timing
npx vitest src/app/api/cart/cart.test.ts

# Run with coverage (slower)
npm run test:coverage
```

Expected times per test:
- Unit tests: 5-50ms
- Integration tests: 20-100ms
- Full suite: < 30 seconds (for ~500 tests)

---

## Configuration Summary

**Optimized Settings:**
- Thread pool: 4 threads (transaction-bound I/O)
- Test timeout: 5 seconds (fast feedback)
- Bail: 5 failures (save time on large failures)
- Isolation: Per-transaction (vs per-test process)
- Connection pool: 10 max, 2 min (reuse)

---

## Troubleshooting Performance Issues

### Tests running slowly?

1. **Check table truncation**
   ```typescript
   // Use specific truncation, not truncateAllTables()
   await dbHelpers.truncateCartTables();
   ```

2. **Verify transaction isolation**
   ```typescript
   // Make sure you're using createTestableUnit()
   await createTestableUnit(async (db) => {
     // test code
   });
   ```

3. **Monitor connection pool**
   ```typescript
   // Check pg logs for connection exhaustion
   // Pool max should be ≤ 10 for database-heavy tests
   ```

4. **Review mock setup**
   ```typescript
   // Mocks should be set up in beforeAll, not beforeEach
   // Use mockValidateServerSession.mockClear() instead of full reset
   ```

---

## Performance Checklist

- [ ] Tests use `createTestableUnit()` for isolation
- [ ] Table truncation is specific (not `truncateAllTables()`)
- [ ] Test groups are organized by feature/table
- [ ] Mocks are selective and initialized in `beforeAll`
- [ ] Fixtures are used for reusable test data
- [ ] No hard sleeps or arbitrary timeouts
- [ ] Database operations are batched with `Promise.all()`
- [ ] Thread pool is configured for your workload
- [ ] Coverage thresholds are realistic (80% is good)