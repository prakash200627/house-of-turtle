"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCT_TABS } from "@/constants/content";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

/**
 * TrendingProducts Component
 * Displays best-selling products grouped into category tabs.
 * Content transitions on tab switches are managed with AnimatePresence.
 */
export function TrendingProducts() {
  const [activeTab, setActiveTab] = useState(PRODUCT_TABS[0]);

  // Filter products by tab selection
  const filteredProducts = products.filter(
    (product) => product.category === activeTab
  );

  return (
    <section className="bg-offwhite py-20 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Subtitle / EyeBrow */}
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-sand mb-3">
          Trending Now
        </span>

        {/* Heading */}
        <h2 className="font-display text-3xl sm:text-display-md text-espresso font-medium tracking-tight text-center mb-8">
          Our bestsellers
        </h2>

        {/* Tabs Grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {PRODUCT_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-pill text-xs font-semibold uppercase tracking-widest transition-colors duration-120 border ${
                  isActive
                    ? "bg-espresso border-espresso text-cream shadow-sm"
                    : "bg-white border-gold/20 text-sand hover:border-gold hover:text-espresso"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid with AnimatePresence */}
        <div className="w-full min-h-[350px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Link Footer */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="relative text-xs uppercase tracking-widest font-bold text-espresso hover:text-gold-bright transition-colors py-1 group inline-block"
          >
            View all products &rarr;
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-bright origin-left transition-transform duration-300 scale-x-100 group-hover:scale-x-0" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default TrendingProducts;
