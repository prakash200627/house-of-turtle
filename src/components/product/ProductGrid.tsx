"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ProductCard } from "./ProductCard";
import { products } from "@/data/products";
import { formatPrice } from "@/lib/utils";

interface ProductGridProps {
  forcedMetal?: "Gold Plated" | "92.5 Sterling Silver";
}

/**
 * ProductGrid Component
 * Displays a catalog grid of premium silver jewellery.
 * Supports filtering by category, gender, and sorting by price or rating.
 * Integrates URL query parameters for deep linking.
 */
export function ProductGrid({ forcedMetal }: ProductGridProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const genderParam = searchParams.get("gender");

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(categoryParam || "all");
  }, [categoryParam]);

  useEffect(() => {
    setSelectedGender(genderParam || "all");
  }, [genderParam]);

  // 1. Filter products by Metal (Gold/Silver)
  let filtered = products.filter((p) => {
    if (!forcedMetal) return true;
    return p.metal === forcedMetal;
  });

  // 2. Filter by Gender (Men/Women)
  if (selectedGender !== "all") {
    filtered = filtered.filter((p) => p.gender === selectedGender);
  }

  // 3. Filter by Category
  if (selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  // Get available categories for the current filters (to dynamically hide empty categories)
  const availableCategories = Array.from(
    new Set(
      products
        .filter((p) => !forcedMetal || p.metal === forcedMetal)
        .filter((p) => selectedGender === "all" || p.gender === selectedGender)
        .map((p) => p.category)
    )
  );

  // 4. Sort filtered products
  const sortedProducts = [...filtered].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "bestseller") {
      if (a.bestseller && !b.bestseller) return -1;
      if (!a.bestseller && b.bestseller) return 1;
    }
    return 0; // retain default Collection -> Category -> Name sort
  });

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-offwhite">
      
      {/* Filters & Sorting Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-gold/15 pb-8 mb-12">
        {/* Gender Filters */}
        <div className="flex items-center gap-2">
          <span className="text-[14px] uppercase font-bold tracking-widest text-sand mr-2">Filter:</span>
          <button
            onClick={() => setSelectedGender("all")}
            className={`px-4 py-1.5 rounded-pill text-[12px] font-bold uppercase tracking-wider transition-colors border ${
              selectedGender === "all"
                ? "bg-espresso border-espresso text-cream shadow-xs"
                : "bg-white border-gold/20 text-sand hover:border-gold hover:text-espresso"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedGender("women")}
            className={`px-4 py-1.5 rounded-pill text-[12px] font-bold uppercase tracking-wider transition-colors border ${
              selectedGender === "women"
                ? "bg-espresso border-espresso text-cream shadow-xs"
                : "bg-white border-gold/20 text-sand hover:border-gold hover:text-espresso"
            }`}
          >
            Women
          </button>
          {/* Hide Men's filter if none are available in this metal */}
          {forcedMetal !== "Gold Plated" && (
            <button
              onClick={() => setSelectedGender("men")}
              className={`px-4 py-1.5 rounded-pill text-[12px] font-bold uppercase tracking-wider transition-colors border ${
                selectedGender === "men"
                  ? "bg-espresso border-espresso text-cream shadow-xs"
                  : "bg-white border-gold/20 text-sand hover:border-gold hover:text-espresso"
              }`}
            >
              Men
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-[12px] uppercase font-bold tracking-widest text-sand mr-2">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-48 px-3 py-2 text-xs font-semibold text-espresso bg-white border border-gold/25 rounded-md focus:border-gold focus:outline-none"
          >
            <option value="featured">Featured Collection</option>
            <option value="bestseller">Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-5 py-2.5 rounded-pill text-xs font-semibold uppercase tracking-widest transition-colors border ${
            selectedCategory === "all"
              ? "bg-espresso border-espresso text-cream shadow-sm"
              : "bg-white border-gold/20 text-sand hover:border-gold hover:text-espresso"
          }`}
        >
          All Categories
        </button>
        {availableCategories.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedCategory(tab)}
            className={`px-5 py-2.5 rounded-pill text-xs font-semibold uppercase tracking-widest transition-colors border ${
              selectedCategory === tab
                ? "bg-espresso border-espresso text-cream shadow-sm"
                : "bg-white border-gold/20 text-sand hover:border-gold hover:text-espresso"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-cream/20 rounded border border-gold/10">
          <p className="font-display text-lg text-sand font-medium uppercase tracking-wider">No Jewellery Found</p>
          <p className="text-xs text-sand/75 mt-1 font-light">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </section>
  );
}

export default ProductGrid;
