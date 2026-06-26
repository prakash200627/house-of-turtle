"use client";

import React, { Suspense } from "react";
import { ProductGrid } from "@/components/product";

export default function GoldPage() {
  return (
    <div className="w-full bg-offwhite">
      {/* Hero Section */}
      <section className="bg-cream/45 py-16 border-b border-gold/10 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-sand block mb-2">Warm Radiance</span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-espresso">
            18K Gold Plated Collection
          </h1>
          <p className="mt-4 text-sm sm:text-base text-sand max-w-xl mx-auto font-light leading-relaxed font-sans">
            Thick, durable 18K gold layer plated over pure sterling silver for an exquisite, long-lasting warmth.
          </p>
        </div>
      </section>

      {/* Filtered Grid */}
      <Suspense fallback={
        <div className="text-center py-20">
          <p className="text-sm text-sand animate-pulse font-semibold tracking-widest uppercase">Loading Gold Jewellery...</p>
        </div>
      }>
        <ProductGrid forcedMetal="Gold Plated" />
      </Suspense>
    </div>
  );
}
