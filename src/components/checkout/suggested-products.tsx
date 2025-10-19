import { ReactNode } from "react";
import { ProductCardWithAddToCart } from "./product-card-with-add-to-cart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProductWithDetails } from "@/app/api/shop/types";
import type { SelectProductImage } from "@/database/schemas/product-images";
import type { SelectProductVariant } from "@/database/schemas/product-variants";
import type { SelectProductOption } from "@/database/schemas/product-options";

/**
 * Extended product type that includes variants and options for checkout functionality.
 */
interface ProductWithVariantsAndOptions extends ProductWithDetails {
  variants: SelectProductVariant[];
  options: SelectProductOption[];
}

/**
 * Mock data for suggested products.
 * This will be replaced with actual AI-generated suggestions later.
 */
const mockSuggestedProducts: ProductWithVariantsAndOptions[] = [
  {
    id: "mock-1",
    title: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    availableForSale: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: null,
    descriptionHtml: null,
    tags: [],
    embedding: null,
    category: null,
    featuredImage: {
      id: "mock-image-1",
      productId: "mock-1",
      url: "https://plus.unsplash.com/premium_photo-1756131939171-728118fbad4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      altText: "Wireless Bluetooth Headphones",
      order: 0,
      width: 300,
      height: 300,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SelectProductImage,
    minPrice: 19999, // $199.99 in cents
    maxPrice: 19999,
    currencyCode: "USD",
    variants: [
      {
        id: "variant-1",
        productId: "mock-1",
        price: 19999,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "One Size" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductVariant,
    ],
    options: [
      {
        id: "option-1",
        productId: "mock-1",
        name: "Size",
        values: ["One Size"],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductOption,
    ],
    variantCount: 1,
  },
  {
    id: "mock-2",
    title: "Smart Fitness Watch",
    description:
      "Track your workouts, heart rate, and sleep with this advanced smartwatch.",
    availableForSale: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: null,
    descriptionHtml: null,
    tags: [],
    embedding: null,
    category: null,
    featuredImage: {
      id: "mock-image-2",
      productId: "mock-2",
      url: "https://plus.unsplash.com/premium_photo-1756131939171-728118fbad4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      altText: "Smart Fitness Watch",
      order: 0,
      width: 300,
      height: 300,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SelectProductImage,
    minPrice: 29999, // $299.99 in cents
    maxPrice: 29999,
    currencyCode: "USD",
    variants: [
      {
        id: "variant-2-small",
        productId: "mock-2",
        price: 29999,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "Small" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductVariant,
      {
        id: "variant-2-medium",
        productId: "mock-2",
        price: 29999,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: [{ name: "Size", value: "Medium" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductVariant,
      {
        id: "variant-2-large",
        productId: "mock-2",
        price: 29999,
        currencyCode: "USD",
        availableForSale: false,
        selectedOptions: [{ name: "Size", value: "Large" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductVariant,
    ],
    options: [
      {
        id: "option-2",
        productId: "mock-2",
        name: "Size",
        values: ["Small", "Medium", "Large"],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductOption,
    ],
    variantCount: 3,
  },
  {
    id: "mock-3",
    title: "Portable Power Bank",
    description: "20000mAh fast-charging power bank with multiple USB ports.",
    availableForSale: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: null,
    descriptionHtml: null,
    tags: [],
    embedding: null,
    category: null,
    featuredImage: {
      id: "mock-image-3",
      productId: "mock-3",
      url: "https://plus.unsplash.com/premium_photo-1756131939171-728118fbad4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      altText: "Portable Power Bank",
      order: 0,
      width: 300,
      height: 300,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SelectProductImage,
    minPrice: 4999, // $49.99 in cents
    maxPrice: 4999,
    currencyCode: "USD",
    variants: [
      {
        id: "variant-3",
        productId: "mock-3",
        price: 4999,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: [{ name: "Capacity", value: "20000mAh" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductVariant,
    ],
    options: [
      {
        id: "option-3",
        productId: "mock-3",
        name: "Capacity",
        values: ["20000mAh"],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductOption,
    ],
    variantCount: 1,
  },
  {
    id: "mock-4",
    title: "Wireless Charging Pad",
    description: "Qi-compatible wireless charging pad for all your devices.",
    availableForSale: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    categoryId: null,
    descriptionHtml: null,
    tags: [],
    embedding: null,
    category: null,
    featuredImage: {
      id: "mock-image-4",
      productId: "mock-4",
      url: "https://plus.unsplash.com/premium_photo-1756131939171-728118fbad4a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      altText: "Wireless Charging Pad",
      order: 0,
      width: 300,
      height: 300,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as SelectProductImage,
    minPrice: 2999, // $29.99 in cents
    maxPrice: 2999,
    currencyCode: "USD",
    variants: [
      {
        id: "variant-4-black",
        productId: "mock-4",
        price: 2999,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "Black" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductVariant,
      {
        id: "variant-4-white",
        productId: "mock-4",
        price: 2999,
        currencyCode: "USD",
        availableForSale: true,
        selectedOptions: [{ name: "Color", value: "White" }],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductVariant,
    ],
    options: [
      {
        id: "option-4",
        productId: "mock-4",
        name: "Color",
        values: ["Black", "White"],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SelectProductOption,
    ],
    variantCount: 2,
  },
];

/**
 * Component that displays suggested products in a grid layout.
 * Products can be added to cart directly or via variant selection modal.
 * Currently uses mock data, will be replaced with actual AI-generated suggestions later.
 */
export function SuggestedProducts(): ReactNode {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockSuggestedProducts.map((product) => (
          <ProductCardWithAddToCart key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
