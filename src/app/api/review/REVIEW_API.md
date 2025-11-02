# Review API Documentation

This document provides comprehensive documentation for the Review API endpoints, including request/response formats, authentication requirements, and usage examples.

## Overview

The Review API allows users to create and retrieve product reviews. Reviews include ratings (0.5-5.0 stars in 0.5 increments) and text content. The API automatically generates embeddings for review content to enable AI-powered summarization and search features.

## Endpoints

### GET /api/review

Retrieves reviews with optional filtering and pagination.

#### Query Parameters

| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| `page`   | number | No      | 1      | Page number (minimum: 1) |
| `limit`  | number | No      | 20     | Items per page (maximum: 100) |
| `productId` | string | No    | -      | Filter reviews by product UUID |

#### Response Format

```typescript
{
  "success": boolean,
  "data": {
    "reviews": Array<{
      "id": string,
      "productId": string,
      "userId": string,
      "rating": number,
      "content": string,
      "embeddingStatus": "pending" | "generated" | "failed",
      "createdAt": string,
      "updatedAt": string,
      "user": {
        "id": string,
        "email": string,
        "name": string | null
      }
    }>,
    "pagination": {
      "currentPage": number,
      "totalPages": number,
      "totalItems": number,
      "itemsPerPage": number,
      "hasNextPage": boolean,
      "hasPreviousPage": boolean
    }
  }
}
```

#### Example Request

```bash
GET /api/review?page=1&limit=10&productId=123e4567-e89b-12d3-a456-426614174000
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "456e7890-e89b-12d3-a456-426614174001",
        "productId": "123e4567-e89b-12d3-a456-426614174000",
        "userId": "789e0123-e89b-12d3-a456-426614174002",
        "rating": 4.5,
        "content": "Excellent product! Highly recommend.",
        "embeddingStatus": "generated",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "user": {
          "id": "789e0123-e89b-12d3-a456-426614174002",
          "email": "user@example.com",
          "name": "John Doe"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### POST /api/review

Creates a new review for a product. Requires user authentication.

#### Authentication

This endpoint requires the user to be authenticated via session.

#### Request Body

| Field | Type   | Required | Validation |
|-------|--------|----------|------------|
| `productId` | string | Yes | Valid UUID |
| `content` | string | Yes | 10-1000 characters |
| `rating` | number | Yes | 0.5-5.0 (0.5 increments) |

#### Request Body Schema

```typescript
{
  "productId": "string", // UUID of the product
  "content": "string",   // Review content (10-1000 chars)
  "rating": number       // Rating from 0.5 to 5.0
}
```

#### Response Format

```typescript
{
  "success": boolean,
  "data": {
    "id": string,
    "productId": string,
    "userId": string,
    "rating": number,
    "content": string,
    "embeddingStatus": "pending" | "generated" | "failed",
    "createdAt": string,
    "updatedAt": string
  }
}
```

#### Example Request

```bash
POST /api/review
Content-Type: application/json

{
  "productId": "123e4567-e89b-12d3-a456-426614174000",
  "content": "This product exceeded my expectations! The quality is outstanding and it arrived quickly.",
  "rating": 4.5
}
```

#### Example Response

```json
{
  "success": true,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "productId": "123e4567-e89b-12d3-a456-426614174000",
    "userId": "789e0123-e89b-12d3-a456-426614174002",
    "rating": 4.5,
    "content": "This product exceeded my expectations! The quality is outstanding and it arrived quickly.",
    "embeddingStatus": "pending",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

## Error Handling

All endpoints use standardized error responses:

```typescript
{
  "message": string,
  "details"?: any
}
```

### Common Error Codes

- **400 Bad Request**: Invalid request parameters or validation errors
- **401 Unauthorized**: Authentication required
- **404 Not Found**: Product not found
- **500 Internal Server Error**: Server-side errors

### Validation Errors

Validation errors include detailed field-level information:

```json
{
  "message": "Input validation failed",
  "errors": {
    "content": ["Review must be at least 10 characters long"],
    "rating": ["Rating cannot exceed 5 stars"]
  }
}
```

## Business Logic

### Review Creation

1. **Authentication**: User must be authenticated
2. **Product Validation**: Product must exist
3. **User Validation**: User profile must exist
4. **Rating Rounding**: Ratings are rounded to 0.5 increments
5. **Embedding Generation**: Review embeddings are generated asynchronously

### Review Retrieval

1. **Optional Filtering**: Filter by product ID
2. **Pagination**: Results are paginated with configurable page size
3. **Sorting**: Reviews are sorted by creation date (newest first)
4. **User Information**: Includes user email and optional name

## Embedding System

Reviews automatically generate embeddings for AI-powered features:

- **Status Tracking**: `pending` → `generated` → `failed`
- **Asynchronous Processing**: Doesn't block review creation
- **Error Handling**: Failed embeddings are marked but don't prevent review creation
- **Vector Storage**: 1536-dimensional vectors for semantic search

## Rate Limiting

Consider implementing rate limiting for review creation to prevent spam:

- Per-user limits (e.g., 5 reviews per hour)
- Per-product limits (e.g., 1 review per user per product)

## Database Schema

```sql
-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating DECIMAL NOT NULL CHECK (rating >= 0.5 AND rating <= 5.0),
  content TEXT NOT NULL,
  embedding_status ENUM('pending', 'generated', 'failed') DEFAULT 'pending',
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX reviews_product_id_index ON reviews(product_id);
CREATE INDEX reviews_user_id_index ON reviews(user_id);
CREATE INDEX embedding_index ON reviews USING hnsw(embedding vector_cosine_ops);
```

## Testing

Comprehensive tests cover:

- **Service Layer**: Unit tests for business logic
- **Route Handlers**: Integration tests for HTTP endpoints
- **Validation**: Input validation and error handling
- **Edge Cases**: Empty results, pagination, filtering
- **Authentication**: Session validation

Run tests with:

```bash
npm test src/app/api/review/review.test.ts
```

## Future Enhancements

- **Review Moderation**: Content filtering and approval workflow
- **Review Voting**: Upvote/downvote system
- **Review Replies**: Threaded conversations
- **Review Analytics**: Aggregate ratings and trends
- **Image Attachments**: Photo reviews
- **Review Summarization**: AI-powered review summaries
