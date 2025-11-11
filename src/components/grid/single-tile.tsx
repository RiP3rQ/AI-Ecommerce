import clsx from "clsx";
import Image from "next/image";
import { CustomLabel } from "@/components/custom-label";
import { preload } from "swr";
import { swrFetcher } from "@/lib/swr-fetcher";
import { BASE_URL } from "@/lib/utils";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  productUuid,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount?: number;
    currencyCode?: string;
    position?: "bottom" | "center";
  };
  productUuid?: string;
} & React.ComponentProps<typeof Image>) {
  const router = useRouter();

  const onHoverHandler = useCallback(() => {
    if (productUuid) {
      router.prefetch(`/product/${productUuid}`, { kind: PrefetchKind.FULL });
      preload(`${BASE_URL}/api/product/${productUuid}`, swrFetcher);
      preload(`${BASE_URL}/api/review?productId=${productUuid}`, swrFetcher);
    }
  }, [productUuid]);

  return (
    <div
      className={clsx(
        "group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-white hover:border-blue-600 dark:bg-black",
        {
          relative: label,
          "border-2 border-blue-600": active,
          "border-neutral-200 dark:border-neutral-800": !active,
        },
      )}
      onMouseEnter={onHoverHandler}
    >
      {props.src ? (
        <Image
          className={clsx("relative h-full w-full object-contain", {
            "transition duration-300 ease-in-out group-hover:scale-105":
              isInteractive,
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <CustomLabel
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
