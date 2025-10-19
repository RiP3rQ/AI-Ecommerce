# Checkout Feature Documentation

## Overview

The checkout page provides a comprehensive shopping experience where users can review their cart items, view AI-generated suggested products, and complete their purchase. This feature is designed for the MVP phase with plans for full payment integration in future iterations.

## Layout and Components

### Page Structure
The checkout page uses a vertical stacking layout with the following components:

1. **Page Header**: Title and description
2. **Cart Items List**: Displays all items in the user's cart
3. **Suggested Products**: AI-generated product recommendations
4. **Order Summary**: Price breakdown and totals
5. **Action Buttons**: Complete purchase or continue shopping

### Components

#### CartItemList (`src/components/checkout/cart-item-list.tsx`)
- **Purpose**: Displays all items currently in the user's cart
- **Features**:
  - Product images, names, and selected variants
  - Quantity controls (+ and - buttons)
  - Remove item functionality
  - Price display for each item
  - Loading states and error handling
  - Empty cart state

#### OrderSummary (`src/components/checkout/order-summary.tsx`)
- **Purpose**: Shows order totals and pricing breakdown
- **Features**:
  - Subtotal calculation
  - Shipping cost (currently "Free" for MVP)
  - Final total
  - Loading states with skeleton placeholders

#### SuggestedProducts (`src/components/checkout/suggested-products.tsx`)
- **Purpose**: Displays AI-generated product recommendations
- **Features**:
  - Grid layout of suggested products
  - Add-to-cart functionality for each product
  - Modal for variant selection when needed
  - Mock data currently, will be replaced with AI suggestions

#### ProductCardWithAddToCart (`src/components/checkout/product-card-with-add-to-cart.tsx`)
- **Purpose**: Product card with integrated add-to-cart functionality
- **Features**:
  - Product image, title, description, and price
  - "Add to Cart" button
  - Variant selection modal for products with options
  - Direct cart addition for simple products

## AI-Powered Suggested Products

### Current Implementation (MVP)
- Uses mock data with 4 sample products
- Demonstrates the UI and interaction patterns
- Includes products with different variant configurations:
  - Simple products (single variant)
  - Products with size/color options

### Future AI Integration
- **AI Service**: Will integrate with Google Gemini API
- **Data Sources**:
  - Current cart contents
  - User's browsing history (future)
  - Product catalog embeddings
- **Generation Logic**:
  - Analyze cart items for complementary products
  - Consider product categories and attributes
  - Generate personalized recommendations
  - Filter out already purchased items

### Technical Implementation
```typescript
// Future AI integration structure
interface AISuggestionRequest {
  cartItems: CartItem[];
  userId: string;
  limit: number;
}

interface AISuggestionResponse {
  products: ProductWithVariantsAndOptions[];
  reasoning: string; // For debugging/analytics
}
```

## Purchase Completion (MVP Implementation)

### Current Flow
When user clicks "Complete Purchase":

1. **Validation**: Ensure cart is not empty
2. **Order Creation**: Insert cart items into orders table
3. **Cart Cleanup**: Remove all items from user's cart
4. **Success Feedback**: Show confirmation message
5. **Redirect**: Optionally redirect to order confirmation page

### Database Schema Changes Needed

#### Orders Table
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'completed',
  total_amount INTEGER NOT NULL, -- in cents
  currency_code VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX orders_user_id_index ON orders(user_id);
CREATE INDEX orders_created_at_index ON orders(created_at);
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES product_variants(id),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price INTEGER NOT NULL, -- price at time of purchase, in cents
  currency_code VARCHAR(3) NOT NULL DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX order_items_order_id_index ON order_items(order_id);
CREATE INDEX order_items_product_variant_id_index ON order_items(product_variant_id);
```

### API Implementation

#### Complete Purchase Endpoint (`POST /api/checkout/complete`)
```typescript
// src/app/api/checkout/complete/route.ts
export async function POST(request: NextRequest) {
  try {
    // 1. Validate user session
    const user = await validateServerSession();

    // 2. Get current cart
    const cart = await cartService.getCart({
      userId: user.id,
      db: drizzleDbClient(),
    });

    if (!cart.items.length) {
      return NextResponse.json(
        { message: 'Cart is empty' },
        { status: 400 }
      );
    }

    // 3. Create order
    const order = await db.transaction(async (tx) => {
      // Insert order
      const [newOrder] = await tx.insert(orders).values({
        userId: user.id,
        totalAmount: cart.totalPrice,
        currencyCode: cart.currencyCode,
      }).returning();

      // Insert order items
      await tx.insert(orderItems).values(
        cart.items.map(item => ({
          orderId: newOrder.id,
          productVariantId: item.productVariant.id,
          quantity: item.quantity,
          price: item.productVariant.price,
          currencyCode: item.productVariant.currencyCode,
        }))
      );

      // Clear cart
      await cartService.clearCart({
        userId: user.id,
        db: tx,
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Purchase completed successfully'
    });

  } catch (error) {
    return handleApiError(error);
  }
}
```

## Future Enhancements

### Payment Integration
- Stripe/PayPal integration
- Multiple payment methods
- Payment security and compliance

### Enhanced AI Suggestions
- User preference learning
- Seasonal/product trend analysis
- Cross-selling algorithms
- A/B testing for recommendation effectiveness

### Order Management
- Order history and tracking
- Order status updates
- Return/refund processing
- Email notifications

### Advanced Features
- Guest checkout (future consideration)
- Multiple shipping addresses
- Gift wrapping options
- Order comments/notes

## Testing Considerations

### Unit Tests
- Component rendering and interactions
- Cart state management
- Form validation
- Error handling

### Integration Tests
- Complete purchase flow
- Cart API interactions
- Order creation and cleanup

### E2E Tests
- Full checkout flow from cart to completion
- Variant selection and modal interactions
- Error scenarios and recovery

## Performance Considerations

- Lazy loading of suggested products
- Image optimization for product cards
- Efficient cart state management
- Database query optimization for order creation
- CDN integration for static assets

## Accessibility

- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management in modals
- ARIA labels and descriptions
