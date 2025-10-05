import { ReactNode } from "react";

interface ProductPageProps {
  params: Promise<{
    productUuid: string;
  }>;
}

export default async function ProductPage({
  params,
}: Readonly<ProductPageProps>): Promise<ReactNode> {
  const { productUuid } = await params;

  return <div>ShopPage {productUuid}</div>;
}
