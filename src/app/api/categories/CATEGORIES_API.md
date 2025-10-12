# Categories API

## Overview

The Categories API provides endpoints for retrieving product categories used in the shop for filtering products.

## Endpoints

### GET /api/categories

Retrieves all categories with optional sorting.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `sortDirection` | `asc` \| `desc` | `asc` | Sort direction |
| `sortField` | `name` \| `createdAt` \| `updatedAt` | `name` | Field to sort by |

#### Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Category Name",
      "description": "Category description",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Error Responses

- **400 Bad Request**: Invalid query parameters
- **500 Internal Server Error**: Unexpected server error

#### Example Usage

```bash
# Get categories sorted by name (ascending)
GET /api/categories

# Get categories sorted by creation date (descending)
GET /api/categories?sortDirection=desc&sortField=createdAt
```

## Usage in Frontend

Categories are used in the shop filter component to allow users to filter products by category. The frontend expects an array of objects with `id` and `name` fields.
