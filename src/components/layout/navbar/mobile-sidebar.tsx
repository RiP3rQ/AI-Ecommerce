"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { MenuIcon, XIcon } from "lucide-react";
import { SelectMenuItemType } from "@/database/schema";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { env } from "@/env";

export function MobileMenu({
  menu,
}: {
  menu: SelectMenuItemType[];
}): ReactNode {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors md:hidden dark:border-neutral-700 dark:text-white"
      >
        <MenuIcon className="h-4" />
      </button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle className="sr-only">
          {`${process.env.NEXT_PUBLIC_SITE_NAME} - Mobile Menu`}
        </DialogTitle>
        <DialogContent
          showCloseButton={false}
          className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full max-w-none translate-x-0 translate-y-0 flex-col bg-white pb-6 dark:bg-black p-4"
        >
          <button
            className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <XIcon className="h-6" />
          </button>

          {menu.length ? (
            <ul className="flex w-full flex-col">
              {menu.map((item: SelectMenuItemType) => (
                <li
                  className="py-2 text-xl text-black transition-colors hover:text-neutral-500 dark:text-white"
                  key={item.title}
                >
                  <Link
                    href={item.path}
                    prefetch={true}
                    onClick={closeMobileMenu}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
