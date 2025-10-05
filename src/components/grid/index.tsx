import clsx from "clsx";
import { ReactNode } from "react";

export function Grid(props: React.ComponentProps<"ul">): ReactNode {
  return (
    <ul
      {...props}
      className={clsx("grid grid-flow-row gap-4", props.className)}
    >
      {props.children}
    </ul>
  );
}

export function GridItem(props: React.ComponentProps<"li">): ReactNode {
  return (
    <li
      {...props}
      className={clsx("aspect-square transition-opacity", props.className)}
    >
      {props.children}
    </li>
  );
}
