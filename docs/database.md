# Database Schema

This document outlines the schema for the project database, managed by Drizzle ORM.

## Tables

### `profiles`

Stores application-specific user data, linked to Supabase's `auth.users` table.

| Column               | Type      | Modifiers                               |
| -------------------- | --------- | --------------------------------------- |
| `id`                 | `uuid`    | **Primary Key**, References `auth.users.id` |
| `acceptedDataPolicy` | `boolean` | `NOT NULL`, `DEFAULT false`             |
| `createdAt`          | `timestamp` | `NOT NULL`, `DEFAULT NOW()`             |
| `updatedAt`          | `timestamp` | `NOT NULL`, `DEFAULT NOW()`             |

---

### `products`

Contains all product information.

| Column             | Type           | Modifiers                           |
| ------------------ | -------------- | ----------------------------------- |
| `id`               | `uuid`         | **Primary Key**                     |
| `availableForSale` | `boolean`      | `NOT NULL`, `DEFAULT true`          |
| `title`            | `varchar(255)` | `NOT NULL`                          |
| `description`      | `text`         |                                     |
| `descriptionHtml`  | `text`         |                                     |
| `tags`             | `jsonb`        | `DEFAULT []`                        |
| `categoryId`       | `uuid`         | FK to `categories.id` (SET NULL)    |
| `embedding`        | `vector(1536)` |                                     |
| `createdAt`        | `timestamp`    | `NOT NULL`, `DEFAULT NOW()`         |
| `updatedAt`        | `timestamp`    | `NOT NULL`, `DEFAULT NOW()`         |

**Relations:**

-   `variants`: Has many `product_variants`
-   `images`: Has many `product_images`
-   `options`: Has many `product_options`
-   `category`: Has one `categories`

---

### `categories`

Stores product categories.

| Column      | Type           | Modifiers               |
| ----------- | -------------- | ----------------------- |
| `id`        | `uuid`         | **Primary Key**         |
| `name`      | `varchar(255)` | `NOT NULL`, `UNIQUE`    |
| `description` | `text`         |                         |
| `createdAt` | `timestamp`    | `NOT NULL`, `DEFAULT NOW()` |
| `updatedAt` | `timestamp`    | `NOT NULL`, `DEFAULT NOW()` |

**Relations:**

-   `products`: Has many `products`

---

### `product_variants`

Defines specific variations of a product (e.g., by size or color).

| Column              | Type                                | Modifiers                      |
| ------------------- | ----------------------------------- | ------------------------------ |
| `id`                | `uuid`                              | **Primary Key**                |
| `productId`         | `uuid`                              | `NOT NULL`, FK to `products.id` (CASCADE) |
| `title`             | `varchar(255)`                      | `NOT NULL`                     |
| `availableForSale`  | `boolean`                           | `NOT NULL`, `DEFAULT true`     |
| `selectedOptions`   | `jsonb`                             | `NOT NULL` (stores `{ name: string; value: string }[]`) |
| `price`             | `integer`                           | `NOT NULL` (in cents)          |
| `currencyCode`      | `varchar(3)`                        | `NOT NULL`                     |
| `inventoryQuantity` | `integer`                           |                                |
| `weight`            | `real`                              |                                |
| `weightUnit`        | `varchar(10)`                       |                                |
| `createdAt`         | `timestamp`                         | `NOT NULL`, `DEFAULT NOW()`    |
| `updatedAt`         | `timestamp`                         | `NOT NULL`, `DEFAULT NOW()`    |

**Relations:**

-   `product`: Has one `products`

---

### `product_images`

Stores images for products.

| Column      | Type        | Modifiers                               |
| ----------- | ----------- | --------------------------------------- |
| `id`        | `uuid`      | **Primary Key**                         |
| `productId` | `uuid`      | `NOT NULL`, FK to `products.id` (CASCADE) |
| `url`       | `text`      | `NOT NULL`                              |
| `altText`   | `text`      |                                         |
| `order`     | `integer`   | `NOT NULL`, `DEFAULT 0`                 |
| `width`     | `integer`   |                                         |
| `height`    | `integer`   |                                         |
| `createdAt` | `timestamp` | `NOT NULL`, `DEFAULT NOW()`             |
| `updatedAt` | `timestamp` | `NOT NULL`, `DEFAULT NOW()`             |

**Relations:**

-   `product`: Has one `products`

---

### `product_options`

Defines the types of options available for a product (e.g., "Size", "Color").

| Column     | Type           | Modifiers                               |
| ---------- | -------------- | --------------------------------------- |
| `id`       | `uuid`         | **Primary Key**                         |
| `productId`| `uuid`         | `NOT NULL`, FK to `products.id` (CASCADE) |
| `name`     | `varchar(100)` | `NOT NULL`                              |
| `position` | `integer`      | `NOT NULL`, `DEFAULT 0`                 |
| `values`   | `jsonb`        | `NOT NULL` (stores `string[]`)            |
| `createdAt`| `timestamp`    | `NOT NULL`, `DEFAULT NOW()`             |
| `updatedAt`| `timestamp`    | `NOT NULL`, `DEFAULT NOW()`             |

**Relations:**

-   `product`: Has one `products`

---

### `carts`

Represents a user's shopping cart.

| Column    | Type        | Modifiers                               |
| --------- | ----------- | --------------------------------------- |
| `id`      | `uuid`      | **Primary Key**                         |
| `userId`  | `uuid`      | `NOT NULL`, `UNIQUE`, FK to `profiles.id` (CASCADE) |
| `createdAt` | `timestamp` | `NOT NULL`, `DEFAULT NOW()`             |
| `updatedAt` | `timestamp` | `NOT NULL`, `DEFAULT NOW()`             |

**Relations:**

-   `user`: Has one `profiles`
-   `items`: Has many `cart_items`

---

### `cart_items`

Represents an item within a shopping cart.

| Column             | Type        | Modifiers                                         |
| ------------------ | ----------- | ------------------------------------------------- |
| `id`               | `uuid`      | **Primary Key**                                   |
| `cartId`           | `uuid`      | `NOT NULL`, FK to `carts.id` (CASCADE)            |
| `productVariantId` | `uuid`      | `NOT NULL`, FK to `product_variants.id` (CASCADE) |
| `quantity`         | `integer`   | `NOT NULL`, `DEFAULT 1`                           |
| `createdAt`        | `timestamp` | `NOT NULL`, `DEFAULT NOW()`                       |
| `updatedAt`        | `timestamp` | `NOT NULL`, `DEFAULT NOW()`                       |

**Relations:**

-   `cart`: Has one `carts`
-   `productVariant`: Has one `product_variants`

---

### `orders`

Stores customer order information.

| Column      | Type              | Modifiers                               |
| ----------- | ----------------- | --------------------------------------- |
| `id`        | `uuid`            | **Primary Key**                         |
| `userId`    | `uuid`            | `NOT NULL`, FK to `profiles.id` (CASCADE) |
| `totalPrice`| `integer`         | `NOT NULL`                              |
| `status`    | `order_status`    | `NOT NULL`, `DEFAULT 'pending'`         |
| `createdAt` | `timestamp`       | `NOT NULL`, `DEFAULT NOW()`             |
| `updatedAt` | `timestamp`       | `NOT NULL`, `DEFAULT NOW()`             |

**Enums:**

-   `order_status`: `pending`, `completed`, `cancelled`

**Relations:**

-   `user`: Has one `profiles`
-   `items`: Has many `order_items`

---

### `order_items`

Represents an item within an order.

| Column            | Type        | Modifiers                                        |
| ----------------- | ----------- | ------------------------------------------------ |
| `id`              | `uuid`      | **Primary Key**                                  |
| `orderId`         | `uuid`      | `NOT NULL`, FK to `orders.id` (CASCADE)          |
| `productVariantId`| `uuid`      | `NOT NULL`, FK to `product_variants.id` (NO ACTION) |
| `quantity`        | `integer`   | `NOT NULL`                                       |
| `priceAtPurchase` | `integer`   | `NOT NULL`                                       |
| `createdAt`       | `timestamp` | `NOT NULL`, `DEFAULT NOW()`                      |
| `updatedAt`       | `timestamp` | `NOT NULL`, `DEFAULT NOW()`                      |

**Relations:**

-   `order`: Has one `orders`
-   `productVariant`: Has one `product_variants`

---

### `reviews`

Stores customer reviews for products.

| Column          | Type                 | Modifiers                               |
| --------------- | -------------------- | --------------------------------------- |
| `id`            | `uuid`               | **Primary Key**                         |
| `productId`     | `uuid`               | `NOT NULL`, FK to `products.id` (CASCADE) |
| `userId`        | `uuid`               | `NOT NULL`, FK to `profiles.id` (CASCADE) |
| `rating`        | `integer`            | `NOT NULL`                              |
| `content`       | `text`               | `NOT NULL`                              |
| `embeddingStatus`| `embedding_status`  | `DEFAULT 'pending'`                     |
| `embedding`     | `vector(1536)`       |                                         |
| `createdAt`     | `timestamp`          | `NOT NULL`, `DEFAULT NOW()`             |
| `updatedAt`     | `timestamp`          | `NOT NULL`, `DEFAULT NOW()`             |

**Enums:**

-   `embedding_status`: `pending`, `generated`, `failed`

**Relations:**

-   `product`: Has one `products`
-   `user`: Has one `profiles`

---

### `review_summaries`

Stores AI-generated summaries of reviews for a product.

| Column    | Type        | Modifiers                                      |
| --------- | ----------- | ---------------------------------------------- |
| `id`      | `uuid`      | **Primary Key**                                |
| `productId` | `uuid`    | `NOT NULL`, `UNIQUE`, FK to `products.id` (CASCADE) |
| `summary` | `text`      | `NOT NULL`                                     |
| `createdAt` | `timestamp` | `NOT NULL`, `DEFAULT NOW()`                    |
| `updatedAt` | `timestamp` | `NOT NULL`, `DEFAULT NOW()`                    |

**Relations:**

-   `product`: Has one `products`
-   `feedbacks`: Has many `review_summary_feedback`

---

### `review_summary_feedback`

Stores user feedback (like/dislike) on review summaries.

| Column    | Type           | Modifiers                                      |
| --------- | -------------- | ---------------------------------------------- |
| `id`      | `uuid`         | **Primary Key**                                |
| `summaryId` | `uuid`       | `NOT NULL`, FK to `review_summaries.id` (CASCADE) |
| `userId`    | `uuid`       | `NOT NULL`, FK to `profiles.id` (CASCADE)      |
| `feedback`  | `feedback_type`| `NOT NULL`                                     |
| `createdAt` | `timestamp`    | `NOT NULL`, `DEFAULT NOW()`                    |
| `updatedAt` | `timestamp`    | `NOT NULL`, `DEFAULT NOW()`                    |

**Enums:**

-   `feedback_type`: `like`, `dislike`

**Relations:**

-   `summary`: Has one `review_summaries`
-   `user`: Has one `profiles`
