"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Product } from "@/types";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

interface CollectionPageLayoutProps {
  metal: "silver" | "gold";
  headline: string;
  eyebrow: string;
  subtext: string;
  filters: string[];
}

export function CollectionPageLayout({
  metal,
  headline,
  eyebrow,
  subtext,
  filters,
}: CollectionPageLayoutProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  // Filter products by metal and category
  const filteredProducts = useMemo(() => {
    const metalLabel = metal === "silver" ? "92.5 Sterling Silver" : "Gold Plated";
    let list = products.filter((p) => p.metal === metalLabel);

    if (activeFilter !== "All") {
      list = list.filter((p) => p.category.toLowerCase() === activeFilter.toLowerCase());
    }

    // Sort products
    return [...list].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "bestseller") return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
      if (sortBy === "new") return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      return 0; // Featured / Default
    });
  }, [metal, activeFilter, sortBy]);

  return (
    <div className="w-full bg-offwhite min-h-screen pb-24">
      {/* Hero Banner */}
      <section
        className={`w-full py-20 text-center px-4 ${
          metal === "silver"
            ? "bg-espresso"
            : "bg-gradient-to-r from-espresso via-[#3C2D24] to-espresso"
        }`}
      >
        <div className="max-w-4xl mx-auto space-y-4">
          <span
            className={`text-xs font-bold uppercase tracking-[0.2em] block ${
              metal === "silver" ? "text-sand" : "text-gold"
            }`}
          >
            {eyebrow}
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream">
            {headline}
          </h1>
          <p className="text-sm sm:text-base text-cream/70 max-w-xl mx-auto font-light leading-relaxed font-sans">
            {subtext}
          </p>
        </div>
      </section>

      {/* Catalog Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gold/10">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-120 border ${
                  activeFilter === filter
                    ? "bg-espresso border-espresso text-cream shadow-xs"
                    : "bg-white border-sand/35 text-sand hover:border-espresso hover:text-espresso"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center self-end md:self-auto gap-2">
            <span className="text-[11px] uppercase font-bold tracking-widest text-sand">
              Sort By:
            </span>
            <div className="relative inline-block">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gold/25 text-espresso rounded-lg pl-4 pr-10 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-gold cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price Low &rarr; High</option>
                <option value="price-high">Price High &rarr; Low</option>
                <option value="bestseller">Best Seller</option>
                <option value="new">New Arrivals</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sand pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Count & Grid */}
        <div className="mt-6">
          <p className="text-[13px] text-sand font-medium uppercase tracking-wider mb-8">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilter}-${sortBy}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default CollectionPageLayout;
