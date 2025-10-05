"use client";

import { ReactNode, useState } from "react";
import OpenCart from "./open-cart-button";
import { Button } from "../ui/button";

export function CartModalWithTrigger(): ReactNode {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openCart = () => {
    setIsOpen(true);
  };

  return (
    <button
      aria-label="Open cart"
      onClick={openCart}
      className="cursor-pointer"
    >
      <OpenCart quantity={undefined} />
    </button>
  );
}
