import { ReactNode, Suspense } from "react";
import { getProductData } from "./actions";
import { notFound } from "next/navigation";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { ProductProvider } from "@/providers/product-provider";
import { Gallery } from "@/components/products/gallery";
import { SelectProductImage } from "@/database/schema";
import { ProductDescription } from "@/components/products/description";

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
  const indexable = !productData.tags?.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: productData.title,
    description: productData.description,
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
  const productData = await getProductData(productUuid);

  if (!productData) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.title,
    description: productData.description,
    image: productData.product_images[0].url,
    offers: {
      "@type": "AggregateOffer",
      availability: productData.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: productData.priceRange.minVariantPrice.currencyCode,
      highPrice: productData.priceRange.maxVariantPrice.amount,
      lowPrice: productData.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={productData.product_images
                  .slice(0, 5)
                  .map((image: SelectProductImage) => ({
                    src: image.url,
                    altText: image.altText ?? "",
                  }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={productData} />
            </Suspense>
          </div>
        </div>
      </div>
    </ProductProvider>
  );
}
