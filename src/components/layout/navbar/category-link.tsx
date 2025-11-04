"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CategoryLinkProps {
  title: string;
  path: string;
  className?: string;
}

export function CategoryLink({
  title,
  path,
  className,
}: CategoryLinkProps): ReactNode {
  const pathname = usePathname();

  const isActivePath = (itemPath: string): boolean => {
    if (itemPath === "/") {
      return pathname === "/";
    }

    // For shop paths, check if pathname starts with the item path
    // This handles cases like /shop/hoodies, /shop/t-shirts, etc.
    return pathname.startsWith(itemPath);
  };

  const isActive = isActivePath(path);

  return (
    <Link
      href={path}
      prefetch={true}
      className={cn(
        "underline-offset-4 transition-colors",
        isActive
          ? "text-black underline dark:text-neutral-100"
          : "text-neutral-500 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300",
        className,
      )}
    >
      {title}
    </Link>
  );
}
