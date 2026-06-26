"use client";

import React, { Suspense } from "react";
import { ProductGrid } from "@/components/product";

/**
 * Shop Page
 * Displays the full silver jewellery product catalog grid.
 */
export default function ShopPage() {
  return (
    <div className="w-full bg-offwhite">
      <section className="bg-cream/45 py-16 border-b border-gold/10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-espresso">
            The Jewellery Catalogue
          </h1>
          <p className="mt-4 text-sm sm:text-base text-sand max-w-xl mx-auto font-light leading-relaxed font-sans">
            Explore our handcrafted 92.5 Sterling Silver collection. Clean, sustainable, and designed for every day.
          </p>
        </div>
      </section>
      <Suspense fallback={
        <div className="text-center py-20">
          <p className="text-sm text-sand animate-pulse font-semibold tracking-widest uppercase">Loading Catalogue...</p>
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </div>
  );
}
