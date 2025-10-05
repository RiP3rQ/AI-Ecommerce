import Link from "next/link";
import { Suspense } from "react";
import { MobileMenu } from "@/components/layout/navbar/mobile-sidebar";
import { env } from "@/env";
import { CartModalWithTrigger } from "@/components/cart/cart-modal";
import { getMenuData } from "./actions";
import { LogoSquare } from "@/components/logo";
import { SelectMenuItemType } from "@/database/schema";

const { NEXT_PUBLIC_SITE_NAME } = env;

export async function Navbar() {
  const menu = await getMenuData();

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-2/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {NEXT_PUBLIC_SITE_NAME}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: SelectMenuItemType) => (
                <li key={item.title}>
                  <Link
                    href={item.path}
                    prefetch={true}
                    className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="flex justify-end md:w-1/3">
          <CartModalWithTrigger />
        </div>
      </div>
    </nav>
  );
}
