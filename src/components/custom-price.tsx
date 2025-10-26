import type { ReactNode } from "react";
import clsx from "clsx";
import { formatFullPrice } from "@/lib/utils";

export function Price({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">): ReactNode {
  const formattedAmount = formatFullPrice({
    price: Number(amount),
    currencyCode,
  });

  return (
    <p suppressHydrationWarning={true} className={className}>
      {formattedAmount}
      <span className={clsx("ml-1 inline", currencyCodeClassName)}>
        {currencyCode}
      </span>
    </p>
  );
}
