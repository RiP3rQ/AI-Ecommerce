import { GridTileImage } from "@/components/grid/single-tile";
import type { SelectProduct } from "@/database/schema";
import Link from "next/link";
import { getLatest3Products, Latest3ProductsReturnType } from "./actions";
import { ReactNode } from "react";
import { Skeleton } from "../ui/skeleton";

function HeroGridItem({
  item,
  size,
  priority,
}: {
  item: Latest3ProductsReturnType;
  size: "full" | "half";
  priority?: boolean;
}): ReactNode {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.products.id}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.product_images?.url ?? ""}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.products.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.products.title as string,
            amount: item.product_variants?.price,
            currencyCode: item.product_variants?.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

export async function HeroThreeItemGrid(): Promise<ReactNode> {
  // Collections that start with `hidden-*` are hidden from the search page.
  const homepageItems = await getLatest3Products();

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <HeroGridItem size="full" item={firstProduct} priority={true} />
      <HeroGridItem size="half" item={secondProduct} priority={true} />
      <HeroGridItem size="half" item={thirdProduct} />
    </section>
  );
}

export function HeroThreeItemGridSkeleton(): ReactNode {
  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <Skeleton className="aspect-square h-full w-full md:col-span-4 md:row-span-2" />
      <Skeleton className="aspect-square h-full w-full md:col-span-2 md:row-span-1" />
      <Skeleton className="aspect-square h-full w-full md:col-span-2 md:row-span-1" />
    </section>
  );
}
