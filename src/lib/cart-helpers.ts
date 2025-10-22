import { CartResponse } from "@/app/api/cart/types";
import { FrontendCart, SelectCartItem } from "@/types/cart";

/**
 * Transforms CartResponse from API to FrontendCart structure
 */
export function transformCartResponse(response: CartResponse): FrontendCart {
  const { cart, totalItems, totalPrice, currencyCode } = response.data;

  const lines: SelectCartItem[] = cart.items.map((item) => {
    return {
      id: item.id,
      quantity: item.quantity,
      cost: {
        totalAmount: {
          amount: String(item.productVariant.price * item.quantity),
          currencyCode: item.productVariant.currencyCode,
        },
      },
      merchandise: {
        id: item.productVariant.id,
        title: item.productVariant.title,
        selectedOptions: item.productVariant.selectedOptions as Array<{
          name: string;
          value: string;
        }>,
        product: {
          id: item.productVariant.product.id,
          handle: item.productVariant.product.id,
          title: item.productVariant.product.title,
          featuredImage: item.featuredImage
            ? {
                url: item.featuredImage.url,
                altText: item.featuredImage.altText || undefined,
                width: item.featuredImage.width || undefined,
                height: item.featuredImage.height || undefined,
              }
            : null,
        },
      },
    };
  });

  return {
    id: cart.id,
    checkoutUrl: "",
    totalQuantity: totalItems,
    lines,
    cost: {
      subtotalAmount: { amount: totalPrice.toString(), currencyCode },
      totalAmount: { amount: totalPrice.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}
