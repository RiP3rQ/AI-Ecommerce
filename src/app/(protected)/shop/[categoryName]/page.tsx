import { ReactNode } from "react";

interface ShopPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

export default async function ShopPage({
  params,
}: Readonly<ShopPageProps>): Promise<ReactNode> {
  const { categoryName } = await params;

  return <div>ShopPage {categoryName}</div>;
}
