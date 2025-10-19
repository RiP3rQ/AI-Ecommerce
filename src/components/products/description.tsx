import { Price } from "@/components/custom-price";
import { VariantSelector } from "./variant-selector";
import Prose from "@/components/global/prose";
import { AddToCart } from "./add-to-cart";
import { ProductData } from "@/app/api/product/[id]/types";
import { useProductProvider } from "@/providers/product-provider";

export function ProductDescription({ product }: { product: ProductData }) {
  const { state } = useProductProvider();
  const getCurrentVariantPrice = () => {
    // Find variant that matches all selected options
    const selectedVariant = product.product_variants.find((variant) => {
      return variant.selectedOptions.every((option) => {
        const optionName = option.name.toLowerCase();
        return state[optionName] === option.value;
      });
    });

    if (selectedVariant && selectedVariant.availableForSale) {
      return {
        amount: selectedVariant.price.toString(),
        currencyCode: selectedVariant.currencyCode,
      };
    }

    // Fallback to first available variant or price range
    const firstAvailableVariant = product.product_variants.find(variant => variant.availableForSale);
    return firstAvailableVariant
      ? {
          amount: firstAvailableVariant.price.toString(),
          currencyCode: firstAvailableVariant.currencyCode,
        }
      : {
          amount: product.priceRange.minVariantPrice.amount.toString(),
          currencyCode: product.priceRange.minVariantPrice.currencyCode,
        };
  };

  const currentPrice = getCurrentVariantPrice();

  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={currentPrice.amount}
            currencyCode={currentPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector
        options={product.product_options}
        variants={product.product_variants}
      />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} variants={product.product_variants} />
    </>
  );
}
