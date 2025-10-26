"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import OpenCart from "./open-cart-button";
import { ShoppingCartIcon, ChevronRightCircleIcon } from "lucide-react";
import { Price } from "../custom-price";
import { DeleteItemButton } from "./delete-item-button";
import Image from "next/image";
import { CheckoutButton } from "./checkout-button";
import { EditItemQuantityButton } from "./edit-quantity-button";
import { useCart } from "@/providers/cart-provider";
import { DEFAULT_OPTION } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import {
  Drawer,
  DrawerTitle,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
  DrawerClose,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { CartItems } from "./cart-items";

export function CartModalWithTrigger(): ReactNode {
  const [quantity, setQuantity] = useState<number>(0);
  const { cart, isOpen, setIsOpen, openCart, closeCart } = useCart();

  useEffect(() => {
    setQuantity(cart?.totalQuantity || 0);
  }, [cart]);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="right">
      <DrawerTrigger asChild>
        <button
          aria-label="Open cart"
          className="cursor-pointer"
          onClick={openCart}
        >
          <OpenCart quantity={quantity} />
        </button>
      </DrawerTrigger>
      <DrawerContent aria-describedby={undefined} className="z-[99]">
        <DrawerHeader>
          <DrawerTitle className="text-2xl font-bold">Cart</DrawerTitle>
        </DrawerHeader>
        <CartItems />
        <Tooltip>
          <DrawerClose asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className="absolute top-4 right-4 group"
              >
                <ChevronRightCircleIcon className="size-4 transition-all duration-200 group-hover:scale-115" />
                <span className="sr-only">Clear cart</span>
              </Button>
            </TooltipTrigger>
          </DrawerClose>
          <TooltipContent>Close cart drawer</TooltipContent>
        </Tooltip>
      </DrawerContent>
    </Drawer>
  );
}
