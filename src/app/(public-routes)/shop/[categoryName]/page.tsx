import { ShopWrapper } from "@/components/shop/wrapper";
import type { ReactNode } from "react";

interface ShopPageProps {
  params: Promise<{
    categoryName: string;
  }>;
}

export default async function ShopPage({
  params,
}: Readonly<ShopPageProps>): Promise<ReactNode> {
  const { categoryName } = await params;

  return <ShopWrapper categoryName={categoryName} />;
}
