import { ReactNode } from "react";
import clsx from "clsx";

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
  const formattedAmount = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(parseFloat(amount));

  return (
    <p suppressHydrationWarning={true} className={className}>
      {formattedAmount}
      <span className={clsx("ml-1 inline", currencyCodeClassName)}>
        {currencyCode}
      </span>
    </p>
  );
}
