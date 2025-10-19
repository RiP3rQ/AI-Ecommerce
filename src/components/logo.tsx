import clsx from "clsx";
import { ReactNode } from "react";
import Image from "next/image";

export function LogoSquare({
  size,
}: {
  size?: "md" | "sm" | undefined;
}): ReactNode {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black",
        {
          "h-[40px] w-[40px] rounded-xl": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
          "h-[50px] w-[50px] rounded-xl": size === "md",
        },
      )}
    >
      <Image
        src="/images/logo.png"
        className={clsx({
          "h-[16px] w-[16px]": !size,
          "h-[10px] w-[10px]": size === "sm",
          "h-[25px] w-[25px]": size === "md",
        })}
        alt="Logo"
      />
    </div>
  );
}
