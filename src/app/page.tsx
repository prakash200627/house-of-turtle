import React from "react";
import {
  Hero,
  CollectionGrid,
  TrendingProducts,
  StyleGuide,
  TrustBar,
  FAQ,
  PromoBanner
} from "@/components/sections";

/**
 * Home Page (App Router)
 * Composes and stacks the homepage sections in the required order.
 */
export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <CollectionGrid />
      <PromoBanner />
      <TrendingProducts />
      <StyleGuide />
      <TrustBar />
      <FAQ />
    </div>
  );
}
