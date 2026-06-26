"use client";

import React, { Suspense } from "react";
import { ProductGrid } from "@/components/product";

export default function SilverPage() {
  return (
    <div className="w-full bg-offwhite">
      {/* Hero Section */}
      <section className="bg-cream/45 py-16 border-b border-gold/10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-sand block mb-2">Pure Craftsmanship</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-espresso">
            92.5 Sterling Silver
          </h1>
          <p className="mt-4 text-sm sm:text-base text-sand max-w-xl mx-auto font-light leading-relaxed font-sans">
            Handcrafted with 92.5% pure hallmarked silver. Designed for daily wear and timeless grace.
          </p>
        </div>
      </section>

      {/* Filtered Grid */}
      <Suspense fallback={
        <div className="text-center py-20">
          <p className="text-sm text-sand animate-pulse font-semibold tracking-widest uppercase">Loading Silver Jewellery...</p>
        </div>
      }>
        <ProductGrid forcedMetal="92.5 Sterling Silver" />
      </Suspense>
    </div>
  );
}
