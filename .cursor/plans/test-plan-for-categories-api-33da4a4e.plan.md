<!-- 33da4a4e-1ba4-45c4-8f34-643cb3711d51 8a5b49b1-6e8e-402b-8d6a-9d6954438261 -->
# Test Plan for /api/categories Endpoint

This plan outlines the test cases for the `GET /api/categories` endpoint to ensure comprehensive coverage of its functionality, including default behavior, sorting, and error handling.

## Test Structure

Tests will be located in `src/app/api/categories/categories.test.ts` and will use Vitest. We will leverage the existing testing utilities as described in `docs/unit-tests.md`:

- `createTestableUnit` for isolated, transactional database tests.
- `dbHelpers.createTestCategory` for seeding test data.
- `NextRequest` for mocking API requests.

## Test Cases

### 1. Default Behavior

- **`it("should return all categories sorted by name in ascending order by default")`**:
- Seed multiple categories with unsorted names.
- Make a `GET` request to `/api/categories` with no query parameters.
- Assert that the response status is 200.
- Assert that the response body contains all seeded categories.
- Assert that the categories are sorted by `name` alphabetically (A-Z).

### 2. Sorting Functionality

- **`it("should sort categories by name in descending order")`**:
- Seed categories.
- Make a `GET` request with `?sortField=name&sortDirection=desc`.
- Assert that the categories are sorted by `name` in reverse alphabetical order (Z-A).
- **`it("should sort categories by createdAt in ascending order")`**:
- Seed categories with different creation timestamps.
- Make a `GET` request with `?sortField=createdAt&sortDirection=asc`.
- Assert that the categories are sorted from oldest to newest.
- **`it("should sort categories by createdAt in descending order")`**:
- Seed categories as above.
- Make a `GET` request with `?sortField=createdAt&sortDirection=desc`.
- Assert that the categories are sorted from newest to oldest.
- **`it("should handle case-insensitive query parameters")`**:
  - Seed categories.
  - Make a `GET` request with `?sortField=NAME&sortDirection=DESC`.
  - Assert that the categories are sorted by name in descending order.

### 3. Edge Cases

- **`it("should return an empty array when no categories exist")`**:
- Do not seed any categories.
- Make a `GET` request to `/api/categories`.
- Assert that the response status is 200 and the `data` array is empty.
- **`it("should fall back to default sorting for invalid sortDirection")`**:
- Seed categories.
- Make a `GET` request with `?sortDirection=invalid`.
- Assert that the response is sorted by `name` in `ascending` order (the default).

### 4. Error Handling

- **`it("should return a 400 Bad Request for an invalid sortField")`**:
- Make a `GET` request with `?sortField=invalidField`.
- Assert that the response status is 400.
- Assert that the response body contains an appropriate error message.

### To-dos

- [ ] Implement the test cases for the `/api/categories` endpoint in `src/app/api/categories/categories.test.ts` according to the plan.