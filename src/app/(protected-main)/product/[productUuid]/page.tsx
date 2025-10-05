import { ReactNode } from "react";
import { getProductData } from "./actions";
import { notFound } from "next/navigation";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { Metadata } from "next";

// ============== METADATA ==============
export async function generateMetadata({
  params,
}: Readonly<ProductPageProps>): Promise<Metadata> {
  const { productUuid } = await params;
  const productData = await getProductData(productUuid);

  if (!productData) return notFound();

  const {
    url,
    width,
    height,
    altText: alt,
  } = productData.product_images[0] || {};
  const indexable = !productData.product.tags?.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: productData.product.title,
    description: productData.product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width: width ?? undefined,
              height: height ?? undefined,
              alt: alt ?? undefined,
            },
          ],
        }
      : null,
  };
}

interface ProductPageProps {
  params: Promise<{
    productUuid: string;
  }>;
}

export default async function ProductPage({
  params,
}: Readonly<ProductPageProps>): Promise<ReactNode> {
  const { productUuid } = await params;
  const product = await getProductData(productUuid);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.product.title,
    description: product.product.description,
    image: product.product_images[0].url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return <div>ShopPage {productUuid}</div>;
}
