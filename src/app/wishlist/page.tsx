"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlistStore } from "@/stores/wishlistStore";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Heart, ShoppingBag } from "lucide-react";
import { useMounted } from "@/hooks/useMounted";

export default function WishlistPage() {
  const mounted = useMounted();
  const { productIds } = useWishlistStore();

  // Find all wishlisted products
  const wishlistedItems = products.filter((p) => productIds.includes(p.id));

  if (!mounted) {
    return (
      <div className="w-full bg-offwhite min-h-screen py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-bright mx-auto"></div>
          <p className="text-xs uppercase tracking-widest text-sand font-bold">Loading Curation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-offwhite min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sand block">
            Your Curation
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-espresso flex items-center justify-center gap-3">
            <Heart className="h-8 w-8 text-gold-bright fill-gold-bright" />
            <span>My Wishlist</span>
          </h1>
          <div className="h-0.5 w-16 bg-gold-bright mt-4 mx-auto" />
        </div>

        <AnimatePresence mode="popLayout">
          {wishlistedItems.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {wishlistedItems.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, y: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-white border border-gold/10 rounded-card p-8 max-w-md mx-auto shadow-card space-y-6"
            >
              <div className="flex justify-center">
                <div className="p-4 bg-cream/30 rounded-full border border-gold/10 text-sand">
                  <Heart className="h-10 w-10 text-sand/50" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-display text-2xl font-bold text-espresso">Your Wishlist is Empty</h3>
                <p className="text-xs text-sand font-light leading-relaxed max-w-xs mx-auto">
                  Add your favourite handcrafted 92.5 Sterling Silver pieces here to keep track of them.
                </p>
              </div>
              <Link
                href="/shop"
                className="w-full inline-flex items-center justify-center bg-espresso hover:bg-espresso/90 text-cream font-semibold py-3.5 rounded-pill text-xs uppercase tracking-widest transition-colors shadow-md mt-4 gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Explore Catalogue</span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
