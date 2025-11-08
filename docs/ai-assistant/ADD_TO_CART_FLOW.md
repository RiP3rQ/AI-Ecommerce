# Add-to-Cart Agentic Flow Implementation

## Overview

This document describes the implementation of the AI-powered add-to-cart flow that allows users to add suggested products to their cart with proper variant selection.

## Flow Architecture

### 3-Step Process

#### Step 1: Server-Side - Get Product Details with Variants
**Tool:** `addToCartProductInformations`
- **Type:** Server-side tool with `execute` function
- **Purpose:** Fetches complete product information including all available variants
- **Input:** Array of `{ productId, productTitle }`
- **Output:** Array of products with variants including:
  - Product ID, title, description, tags
  - Variants array with: ID, title, price, currency, availability, selected options

#### Step 2: Client-Side - User Confirmation & Variant Selection
**Tool:** `clientSideConfirmationForCartModification`
- **Type:** Client-side tool WITHOUT `execute` function
- **Purpose:** Displays modal for user to select variants and quantities
- **Input:** Array of products with available variants
- **User Actions:**
  - Review suggested products
  - Select variants (size, color, etc.) for each product
  - Choose quantities (1-10)
  - Accept or reject individual products
- **Output:** Array of `{ productVariantId, quantity }` for selected items

#### Step 3: Server-Side - Save to Cart
**Tool:** `saveTheFrontendSelectedProductToCart`
- **Type:** Server-side tool with `execute` function
- **Purpose:** Saves user-selected items to the database
- **Input:** `{ userId, items: [{ productVariantId, quantity }] }`
- **Output:** Success response with details of added items

## Frontend Components

### 1. AddToCartModal Component
**File:** `src/components/chatbot/add-to-cart-modal.tsx`

**Features:**
- Displays multiple products in a scrollable list
- Shows variant selection dropdowns (e.g., Size, Color)
- Quantity selector (1-10)
- Individual product accept/reject
- Auto-selects first available variant
- Shows real-time pricing based on selections
- Handles out-of-stock variants

**Props:**
```typescript
interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductWithVariants[];
  onConfirm: (selectedItems: SelectedProduct[]) => void;
  isLoading?: boolean;
}
```

### 2. MessageList Component
**File:** `src/components/chatbot/message-list.tsx`

**Key Changes:**
- Detects `tool-clientSideConfirmationForCartModification` in message parts
- Shows "Review & Add to Cart" button when tool is in `input-available` state
- Opens modal with product data
- Calls `addToolResult()` to send user selections back to backend

### 3. Chat Component
**File:** `src/components/chatbot/chat.tsx`

**Key Changes:**
- Added `addToolResult` from `useChat()` hook
- Added `sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls`
- Passes `addToolResult` to MessageList component

## Backend Tools

### Tool Files

1. **src/ai/tools/add-to-cart-product-informations.ts**
   - Fetches products with variants from database
   - Uses `getProductDetailsWithVariants()` helper

2. **src/ai/tools/return-information-for-confirming-cart-modification.ts**
   - Client-side tool definition
   - Defines input schema for product variants

3. **src/ai/tools/confirm-add-to-cart.ts**
   - Processes multiple items in parallel
   - Adds items to cart using `addToCart()` helper
   - Returns success/failure status for each item

### Helper Functions

**File:** `src/ai/tool-helpers/product-tools.ts`

**New Function:** `getProductDetailsWithVariants()`
- Fetches multiple products by IDs
- Includes all variants with full details
- Returns structured data for frontend display

## User Experience Flow

1. **AI suggests products:** "I think these items would look great together!"
2. **AI calls Step 1:** Fetches product details with variants
3. **AI calls Step 2:** Triggers client-side confirmation
4. **Frontend shows button:** "🛒 Ready to add X products to your cart"
5. **User clicks button:** Modal opens with product list
6. **User selects variants:** Chooses sizes, colors, quantities
7. **User confirms:** Clicks "Add X Items to Cart"
8. **Frontend calls addToolResult():** Sends selections to backend
9. **AI calls Step 3:** Saves items to database
10. **AI confirms:** "Successfully added X items to your cart!"

## Key Features

✅ Multi-product handling
✅ Variant selection (size, color, etc.)
✅ Quantity selection (1-10)
✅ Real-time price calculation
✅ Out-of-stock detection
✅ Individual product accept/reject
✅ Parallel database operations
✅ Error handling and feedback
✅ Loading states
✅ Responsive modal design

## AI SDK Integration

Uses the **AI SDK's tool system** for seamless client-server interaction:
- `addToolResult()` sends data from frontend to backend
- `sendAutomaticallyWhen` automatically submits after tool results
- Type-safe tool definitions with Zod schemas
- Tool state management (`input-available`, `output-available`, `output-error`)

## Testing the Flow

To test the add-to-cart flow:
1. Ask the AI: "I need a complete outfit for a party"
2. AI will suggest products
3. Modal will appear for variant selection
4. Select your preferences and confirm
5. Items will be added to cart

## Future Enhancements

- Image previews in modal
- Wishlist alternative
- Size recommendations
- Stock quantity display
- Price comparisons
- Discount calculations

