import { DEFAULT_OPTION } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { ShoppingCartIcon, LogInIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Price } from "../custom-price";
import { CheckoutButton } from "./checkout-button";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-quantity-button";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/providers/cart-provider";
import Image from "next/image";
import Link from "next/link";

export function CartItems(): ReactNode {
  const { isAuthenticated } = useAuth();
  const { cart, closeCart } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
        <LogInIcon className="h-16" />
        <p className="mt-6 text-center text-2xl font-bold">
          Please log in to view your cart.
        </p>
      </div>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
        <ShoppingCartIcon className="h-16" />
        <p className="mt-6 text-center text-2xl font-bold">
          Your cart is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between overflow-hidden m-4 p-2 overflow-y-auto overflow-x-visible">
      <ul className="grow py-4 ">
        {cart.lines
          .sort((a, b) =>
            a.merchandise.product.title.localeCompare(
              b.merchandise.product.title,
            ),
          )
          .map((item, i) => {
            const merchandiseSearchParams = {} as Record<string, string>;

            item.merchandise.selectedOptions.forEach(({ name, value }) => {
              if (value !== DEFAULT_OPTION) {
                merchandiseSearchParams[name.toLowerCase()] = value;
              }
            });

            const merchandiseUrl = createUrl(
              `/product/${item.merchandise.product.handle}`,
              new URLSearchParams(merchandiseSearchParams),
            );

            return (
              <li
                key={i}
                className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
              >
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <div className="absolute z-40 -ml-2 -mt-4 overflow-visible">
                    <DeleteItemButton item={item} />
                  </div>
                  <div className="flex flex-row">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                      <Image
                        className="h-full w-full object-cover"
                        width={64}
                        height={64}
                        alt={
                          item.merchandise.product.featuredImage?.altText ||
                          item.merchandise.product.title
                        }
                        src={item.merchandise.product.featuredImage?.url || ""}
                      />
                    </div>
                    <Link
                      href={merchandiseUrl}
                      onClick={closeCart}
                      className="z-30 ml-2 flex flex-row space-x-4"
                    >
                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight">
                          {item.merchandise.product.title}
                        </span>
                        {item.merchandise.title !== DEFAULT_OPTION ? (
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {item.merchandise.title}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  </div>
                  <div className="flex h-16 flex-col justify-between">
                    <Price
                      className="flex justify-end space-y-2 text-right text-sm"
                      amount={item.cost.totalAmount.amount}
                      currencyCode={item.cost.totalAmount.currencyCode}
                    />
                    <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                      <EditItemQuantityButton item={item} type="minus" />
                      <p className="w-6 text-center">
                        <span className="w-full text-sm">{item.quantity}</span>
                      </p>
                      <EditItemQuantityButton item={item} type="plus" />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
      </ul>
      <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
          <p>Taxes</p>
          <Price
            className="text-right text-base text-black dark:text-white"
            amount={cart.cost.totalTaxAmount.amount}
            currencyCode={cart.cost.totalTaxAmount.currencyCode}
          />
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Shipping</p>
          <p className="text-right">Calculated at checkout</p>
        </div>
        <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 pt-1 dark:border-neutral-700">
          <p>Total</p>
          <Price
            className="text-right text-base text-black dark:text-white"
            amount={cart.cost.totalAmount.amount}
            currencyCode={cart.cost.totalAmount.currencyCode}
          />
        </div>
      </div>
      <CheckoutButton />
    </div>
  );
}
