# Shop API Endpoint

## Overview

The `/api/shop` endpoint provides comprehensive product filtering, sorting, and pagination capabilities for the e-commerce platform. It follows the standardized Next.js API structure with proper error handling, validation, and service layer separation.

## Endpoint

**GET** `/api/shop`

## Architecture

The endpoint follows a clean three-layer architecture:

1. **`route.ts`** - HTTP handler that validates requests and returns responses
2. **`service.ts`** - Business logic for product querying and filtering
3. **`dto.ts`** - Request validation schemas using Zod
4. **`types.ts`** - TypeScript type definitions for responses

## Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | 1 | Page number (min: 1) |
| `limit` | number | 10 | Items per page (min: 1, max: 100) |
| `sortDirection` | enum | "asc" | Sort direction: "asc" or "desc" |
| `sortField` | enum | "createdAt" | Sort by: "createdAt", "updatedAt", "title", "price", "availableForSale" |
| `search` | string | - | Search term for product title/description |
| `category` | string | - | Filter by category name |
| `priceMin` | number | - | Minimum price in cents |
| `priceMax` | number | - | Maximum price in cents |
| `availableForSale` | boolean | - | Filter by availability |

## Request Examples

### Basic Request
```bash
GET /api/shop
```

### With Pagination
```bash
GET /api/shop?page=2&limit=20
```

### With Search
```bash
GET /api/shop?search=laptop
```

### With Category Filter
```bash
GET /api/shop?category=Electronics
```

### With Price Range
```bash
GET /api/shop?priceMin=1000&priceMax=50000
```

### Combined Filters
```bash
GET /api/shop?category=Electronics&priceMin=1000&priceMax=50000&search=laptop&sortField=price&sortDirection=asc&page=1&limit=12
```

## Response Format

### Success Response (200)

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "uuid",
        "title": "Product Name",
        "description": "Product description",
        "descriptionHtml": "<p>Product description</p>",
        "tags": ["tag1", "tag2"],
        "categoryId": "uuid",
        "availableForSale": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z",
        "category": {
          "id": "uuid",
          "name": "Category Name",
          "description": "Category description"
        },
        "featuredImage": {
          "id": "uuid",
          "url": "https://example.com/image.jpg",
          "altText": "Product image",
          "order": 0,
          "width": 800,
          "height": 600
        },
        "minPrice": 1999,
        "maxPrice": 2999,
        "currencyCode": "USD",
        "variantCount": 3
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### Error Responses

#### 400 - Bad Request (Invalid Parameters)
```json
{
  "message": "Input validation failed",
  "errors": {
    "priceMin": ["Minimum price must be at least 0."]
  }
}
```

#### 400 - Invalid Price Range
```json
{
  "message": "Invalid price range. Minimum price must be less than maximum price."
}
```

#### 404 - Category Not Found
```json
{
  "message": "Category \"InvalidCategory\" does not exist."
}
```

#### 500 - Internal Server Error
```json
{
  "message": "An unexpected internal server error occurred."
}
```

## Error Handling

The endpoint uses custom error classes for specific failure scenarios:

- **`InvalidPriceRangeError`** - When priceMin > priceMax
- **`CategoryNotFoundError`** - When filtering by non-existent category
- **`InvalidSortFieldError`** - When invalid sort field is provided

All errors are handled by the centralized `handleApiError` function, which provides consistent error responses.

## Features

### 1. **Pagination**
- Configurable page size (1-100 items per page)
- Complete pagination metadata in responses
- Efficient offset-based pagination

### 2. **Sorting**
- Multiple sort fields supported
- Ascending and descending order
- Optimized database queries with indexes

### 3. **Full-Text Search**
- Searches product titles and descriptions
- Case-insensitive matching
- Uses PostgreSQL `ILIKE` for performance

### 4. **Price Range Filtering**
- Filter by minimum and/or maximum price
- Prices stored as integers (cents)
- Validation to ensure logical ranges

### 5. **Category Filtering**
- Filter products by category name
- Validates category exists before filtering
- Returns products with category details

### 6. **Availability Filtering**
- Filter by product availability status
- Boolean filter for available/unavailable products

### 7. **Rich Product Data**
- Includes category information
- Featured image (first image by order)
- Price range (min/max from variants)
- Variant count
- Currency code

## Database Queries

The service uses Drizzle ORM for type-safe database queries with:

- **Efficient joins** - Fetches related data in a single query
- **Indexed fields** - Leverages database indexes for performance
- **Counted queries** - Separate count query for accurate pagination
- **Conditional filtering** - Builds WHERE clauses dynamically

## Validation

All input validation is handled by Zod schemas in `dto.ts`:

- Type validation (numbers, strings, booleans)
- Range validation (min/max values)
- Enum validation (allowed values)
- Cross-field validation (price range logic)

## Type Safety

The endpoint is fully type-safe with:

- TypeScript interfaces for all data structures
- Inferred types from Zod schemas
- Database schema type inference from Drizzle
- Proper return types for all functions

## Testing

To test the endpoint:

```bash
# Basic request
curl http://localhost:3000/api/shop

# With filters
curl "http://localhost:3000/api/shop?category=Electronics&priceMin=1000&search=laptop&page=1&limit=12"

# With sorting
curl "http://localhost:3000/api/shop?sortField=price&sortDirection=desc"
```

## Performance Considerations

- Database indexes on commonly queried fields
- Efficient pagination with OFFSET/LIMIT
- Single query for products with relations
- Proper WHERE clause construction
- Price filtering after initial query (due to aggregation needs)

## Future Enhancements

Potential improvements:

1. **Cursor-based pagination** for large datasets
2. **Price sorting** at database level using aggregation
3. **Advanced search** with full-text search indexes
4. **Faceted filtering** with count aggregations
5. **Caching** for frequently accessed queries
6. **Vector search** using product embeddings

