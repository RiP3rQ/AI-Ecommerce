<!-- ece43069-fe7d-468f-a615-81ad052d375f 4dffda42-4777-4667-a827-f9f2a06405d1 -->
# Checkout Page Implementation Plan

This plan details the creation of the checkout page, which will display the current cart contents and a section for suggested products. For this initial version, the suggested products will be mocked.

## 1. Create Checkout Page Components

To keep the code organized and reusable, I will create a new directory `src/components/checkout` and add the following components:

-   `src/components/checkout/cart-item-list.tsx`: This component will fetch the cart data using the existing `useCart` hook from `src/providers/cart-provider.tsx` and display the list of items in the cart. It will show product images, names, variants, quantities, and prices for each item. It will also include controls to modify item quantities or remove items from the cart.
-   `src/components/checkout/order-summary.tsx`: This component will display the order totals, including subtotal, shipping costs (mocked as "Free"), and the final total.
-   `src/components/checkout/suggested-products.tsx`: This component will display a horizontally scrollable list of mocked "You might also like" product suggestions. I will reuse the existing `src/components/shop/product-card.tsx` for consistent styling.

## 2. Update the Checkout Page

I will update `src/app/(protected-main)/checkout/page.tsx` to structure the new checkout page.

The layout will consist of a two-column grid:

-   **Left Column**: This area will contain the main checkout information. I'll place the `cart-item-list.tsx` and `order-summary.tsx` components here.
-   **Right Column**: This area will be dedicated to the `suggested-products.tsx` component.

I will use shadcn UI components like `Card`, `Button`, and `Separator` to build a clean and modern interface, consistent with the rest of the application. Loading states will be handled using `Skeleton` components to ensure a smooth user experience while cart data is being fetched.

### To-dos

- [ ] Create new directory and files for checkout components.
- [ ] Implement the CartItemList component to display items from the cart.
- [ ] Implement the OrderSummary component to show totals.
- [ ] Implement the SuggestedProducts component with mocked data.
- [ ] Assemble the components in the main checkout page file.