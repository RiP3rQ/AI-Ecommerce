import { HeroThreeItemGrid } from "@/components/grid/hero";
import { ItemsMarquee } from "@/components/marquee";
import type { ReactNode } from "react";

export default function Page(): ReactNode {
  return (
    <>
      <HeroThreeItemGrid />
      <ItemsMarquee />
    </>
  );
}
