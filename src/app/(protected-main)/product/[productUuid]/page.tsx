import { ReactNode } from "react";
import { ProductProvider } from "@/providers/product-provider";
import { ProductDetails } from "@/components/products/details";

interface ProductPageProps {
  params: Promise<{
    productUuid: string;
  }>;
}

export default async function ProductPage({
  params,
}: Readonly<ProductPageProps>): Promise<ReactNode> {
  const { productUuid } = await params;

  return (
    <ProductProvider>
      <ProductDetails productUuid={productUuid} />
    </ProductProvider>
  );
}
