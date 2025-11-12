"use client";

import { type ReactNode, useEffect, useState } from "react";
import OpenCart from "./open-cart-button";
import { ChevronRightCircleIcon } from "lucide-react";
import { useCartState, useCartTotalQuantity } from "@/hooks/use-cart";
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
import { CartItems } from "./cart-items";

export function CartDrawerWithTrigger(): ReactNode {
  const {
    isOpen,
    setIsOpen,
    openCart,
    direction: directionOfTheSheet,
  } = useCartState();
  const quantity = useCartTotalQuantity();

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      direction={directionOfTheSheet}
    >
      <DrawerTrigger asChild>
        <button
          aria-label="Open cart"
          className="cursor-pointer"
          onClick={openCart}
        >
          <OpenCart quantity={quantity} />
        </button>
      </DrawerTrigger>
      <DrawerContent aria-describedby={undefined} className="z-99">
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
