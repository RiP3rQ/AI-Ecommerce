# Main Page API

## Overview

The Main Page API provides endpoints for retrieving data needed to display the main page of the e-commerce application. This includes the latest products with their images and variants.

## Endpoints

### GET /api/main-page

Retrieves the latest 3 products for display on the main page, including their main images and variant information.

#### Authentication

This endpoint requires authentication. A valid user session is required to access the data.

#### Response

```json
{
  "success": true,
  "data": [
    {
      "products": {
        "id": "uuid",
        "title": "Product Title",
        "description": "Product description",
        "descriptionHtml": "Product description in HTML",
        "tags": ["tag1", "tag2"],
        "categoryId": "uuid",
        "availableForSale": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      },
      "product_images": {
        "id": "uuid",
        "productId": "uuid",
        "url": "https://example.com/image.jpg",
        "altText": "Alt text for image",
        "order": 1,
        "width": 800,
        "height": 600,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      } | null,
      "product_variants": {
        "id": "uuid",
        "productId": "uuid",
        "title": "Variant Title",
        "selectedOptions": [],
        "price": 10000,
        "currencyCode": "USD",
        "availableForSale": true,
        "inventoryQuantity": 10,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      } | null
    }
  ]
}
```

#### Error Responses

- **401 Unauthorized**: User is not authenticated
- **500 Internal Server Error**: Unexpected server error

#### Example Usage

```bash
# Get main page data (requires authentication)
GET /api/main-page
```

## Data Structure

The response includes an array of the 3 most recently created products, ordered by creation date (newest first). Each product item includes:

- **products**: Complete product information
- **product_images**: The main product image (where `order = 1`) or `null` if no image exists
- **product_variants**: Product variant information or `null` if no variant exists

## Usage in Frontend

The main page component uses this API to display the latest products. The data structure is designed to work directly with the existing product display components.
