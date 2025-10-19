import { Price } from "@/components/custom-price";
import { VariantSelector } from "./variant-selector";
import Prose from "@/components/global/prose";
import { AddToCart } from "./add-to-cart";
import { ProductData } from "@/app/api/product/[productUuid]/types";

export function ProductDescription({ product }: { product: ProductData }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount.toString()}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
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
