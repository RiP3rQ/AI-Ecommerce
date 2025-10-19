# Cart API Documentation

This document provides detailed documentation for the Cart API endpoints.

## Base URL

All API endpoints are relative to the base URL: `/api/cart`

## Authentication

All cart endpoints require a valid user session. Requests made without authentication will receive a `401 Unauthorized` error.

## Error Handling

The API returns standardized error responses.

-   **400 Bad Request**: Returned for input validation errors (e.g., invalid UUID, quantity less than 1). The response body will include details about the validation errors.
-   **401 Unauthorized**: Returned if the user is not authenticated.
-   **404 Not Found**: Returned if a resource (like a cart, cart item, or product variant) is not found.
-   **500 Internal Server Error**: Returned for unexpected server errors.

---

## 1. Get Cart

-   **Method**: `GET`
-   **Path**: `/api/cart`
-   **Description**: Retrieves the current user's cart, including all items and their product details. If the user does not have a cart, a new one is created and returned.

### Query Parameters

| Parameter | Type   | Description                               | Required |
| :-------- | :----- | :---------------------------------------- | :------- |
| `cartId`  | `uuid` | The ID of a specific cart to retrieve.    | No       |

### Success Response

-   **Status Code**: `200 OK`
-   **Body**: `CartResponse`

```json
{
  "success": true,
  "data": {
    "cart": {
      "id": "c1a2b3c4-...",
      "userId": "u1a2b3c4-...",
      "createdAt": "...",
      "updatedAt": "...",
      "items": [
        {
          "id": "i1a2b3c4-...",
          "cartId": "c1a2b3c4-...",
          "productVariantId": "v1a2b3c4-...",
          "quantity": 2,
          "createdAt": "...",
          "updatedAt": "...",
          "productVariant": {
            "id": "v1a2b3c4-...",
            "productId": "p1a2b3c4-...",
            "title": "Red / Small",
            "price": 999,
            "currencyCode": "USD",
            "product": {
              "id": "p1a2b3c4-...",
              "title": "Awesome T-Shirt"
            }
          }
        }
      ]
    },
    "totalItems": 2,
    "totalPrice": 1998,
    "currencyCode": "USD"
  }
}
```

### Error Responses

-   `401 Unauthorized`: If the user is not logged in.
-   `404 Not Found`: If the specified cart is not found (`CartNotFoundError`).

---

## 2. Add Item to Cart

-   **Method**: `POST`
-   **Path**: `/api/cart`
-   **Description**: Adds a product variant to the user's cart. If the item already exists in the cart, its quantity is increased.

### Request Body

```json
{
  "productVariantId": "string (uuid)",
  "quantity": "integer (>= 1)"
}
```

| Field              | Type    | Description                           | Validation Rules      |
| :----------------- | :------ | :------------------------------------ | :-------------------- |
| `productVariantId` | `uuid`  | The ID of the product variant to add. | Must be a valid UUID. |
| `quantity`         | `integer` | The number of items to add.           | Must be at least 1.   |

### Success Response

-   **Status Code**: `200 OK`
-   **Body**: `CartResponse` (The body is the same as the `GET /api/cart` response, showing the updated cart state).

### Error Responses

-   `400 Bad Request`:
    -   If `productVariantId` or `quantity` are invalid (`ZodError`).
    -   If `quantity` is less than 1 (`InvalidQuantityError`).
    -   If there is not enough stock for the item (`InsufficientInventoryError`).
-   `401 Unauthorized`: If the user is not logged in.
-   `404 Not Found`: If the `productVariantId` does not correspond to an existing, available product variant (`ProductVariantNotFoundError`).

---

## 3. Update Cart Item Quantity

-   **Method**: `PATCH`
-   **Path**: `/api/cart`
-   **Description**: Updates the quantity of a specific item already in the cart.

### Request Body

```json
{
  "cartItemId": "string (uuid)",
  "quantity": "integer (>= 1)"
}
```

| Field        | Type    | Description                       | Validation Rules      |
| :----------- | :------ | :-------------------------------- | :-------------------- |
| `cartItemId` | `uuid`  | The ID of the cart item to update. | Must be a valid UUID. |
| `quantity`   | `integer` | The new quantity for the item.    | Must be at least 1.   |

### Success Response

-   **Status Code**: `200 OK`
-   **Body**: `CartResponse` (The body is the same as the `GET /api/cart` response, showing the updated cart state).

### Error Responses

-   `400 Bad Request`:
    -   If `cartItemId` or `quantity` are invalid (`ZodError`).
    -   If `quantity` is less than 1 (`InvalidQuantityError`).
    -   If there is not enough stock for the new quantity (`InsufficientInventoryError`).
-   `401 Unauthorized`: If the user is not logged in.
-   `404 Not Found`: If the `cartItemId` does not correspond to an item in the user's cart (`CartItemNotFoundError`).

---

## 4. Remove Item from Cart

-   **Method**: `DELETE`
-   **Path**: `/api/cart`
-   **Description**: Removes an item completely from the user's cart.

### Request Body

```json
{
  "cartItemId": "string (uuid)"
}
```

| Field        | Type   | Description                         | Validation Rules      |
| :----------- | :----- | :---------------------------------- | :-------------------- |
| `cartItemId` | `uuid` | The ID of the cart item to remove.  | Must be a valid UUID. |

### Success Response

-   **Status Code**: `200 OK`
-   **Body**: `DeleteCartItemResponse`

```json
{
  "success": true,
  "data": {
  },
  "message": "Item removed from cart successfully."
}
```

### Error Responses

-   `400 Bad Request`: If `cartItemId` is invalid (`ZodError`).
-   `401 Unauthorized`: If the user is not logged in.
-   `404 Not Found`: If the `cartItemId` does not correspond to an item in the user's cart (`CartItemNotFoundError`).

---

## 5. Complete Checkout

-   **Method**: `POST`
-   **Path**: `/api/cart/checkout`
-   **Description**: Completes the checkout process by creating an order from the user's current cart items and clearing the cart. This endpoint is used for MVP without payment gateway integration.

### Request Body

```json
{}
```

The request body should be an empty object as the checkout processes the current user's cart.

### Success Response

-   **Status Code**: `200 OK`
-   **Body**: `CheckoutResponse`

```json
{
  "success": true,
  "orderId": "string (uuid)",
  "totalItems": "integer",
  "totalPrice": "integer (in cents)",
  "currencyCode": "string",
  "message": "Purchase completed successfully"
}
```

### Error Responses

-   `400 Bad Request`: If the user's cart is empty (`EmptyCartError`).
-   `401 Unauthorized`: If the user is not logged in.
-   `500 Internal Server Error`: If there's an unexpected error during order creation or cart clearing.