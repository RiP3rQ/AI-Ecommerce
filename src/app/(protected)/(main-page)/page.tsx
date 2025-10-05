import { HeroThreeItemGrid } from "@/components/grid/hero";
import { Navbar } from "@/components/layout/navbar";
import { ReactNode } from "react";

export default function Page(): ReactNode {
  return (
    <>
      <Navbar />
      <HeroThreeItemGrid />
    </>
  );
}
