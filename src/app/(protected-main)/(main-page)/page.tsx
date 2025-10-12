import { HeroThreeItemGrid } from "@/components/grid/hero";
import Footer from "@/components/layout/footer";
import { ItemsMarquee } from "@/components/marquee";
import { ReactNode } from "react";

export default function Page(): ReactNode {
  return (
    <>
      <HeroThreeItemGrid />
      <ItemsMarquee />
    </>
  );
}
