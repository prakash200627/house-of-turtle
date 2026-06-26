"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { Product } from "@/types";
import { Badge } from "@/components/common/Badge";
import { StarRating } from "@/components/common/StarRating";
import { formatPrice } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlistStore";
import { QuickAdd } from "./QuickAdd";

interface ProductCardProps {
  product: Product;
}

/**
 * ProductCard Component
 * Displays a single jewellery product.
 * Integrates image crossfading, Quick Add slider, and wishlist toggling.
 */
export function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const { productIds, toggleWishlist } = useWishlistStore();

  const isWishlisted = productIds.includes(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickAddOpen(true);
  };

  // Safe check for badges
  const badgeVariant = 
    product.badge === "Flash Sale" ? "sale" :
    product.badge === "New" ? "new" :
    product.badge === "Limited" || product.badge === "Sold Out" ? "low-stock" : "gold";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="h-full"
      >
        <Link 
          href={`/products/${product.slug}`}
          className="group bg-white border border-gold/5 shadow-card hover:shadow-card-hover rounded-card overflow-hidden transition-shadow duration-120 flex flex-col h-full"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
        {/* Image Display Area (1:1 Ratio) */}
        <div className="relative aspect-square w-full overflow-hidden bg-cream">
          {/* Main Image [0] */}
          <div className="absolute inset-0 z-0">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-w-768px) 50vw, (max-w-1024px) 33vw, 25vw"
              priority={false}
              className="object-cover"
              unoptimized={true}
            />
          </div>

          {/* Hover Image [1] with Framer Motion */}
          {product.images[1] && (
            <motion.div 
              className="absolute inset-0 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: hovered ? 1 : 0 }}
              transition={{ duration: 0.18, ease: "easeInOut" }}
            >
              <Image
                src={product.images[1]}
                alt={`${product.name} - alternate view`}
                fill
                sizes="(max-w-768px) 50vw, (max-w-1024px) 33vw, 25vw"
                className="object-cover"
                unoptimized={true}
              />
            </motion.div>
          )}

          {/* Dark Overlay scrim on hover */}
          <motion.div
            className="absolute inset-0 bg-espresso/15 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.15 }}
          />

          {/* Product Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-30 pointer-events-none">
              <Badge label={product.badge} variant={badgeVariant} />
            </div>
          )}

          {/* Wishlist Toggle Heart */}
          <button
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 z-30 p-2 rounded-full bg-white/90 shadow-sm backdrop-blur-xs text-espresso hover:text-gold-bright transition-[color,transform,opacity] duration-120 md:opacity-0 md:group-hover:opacity-100 ${
              isWishlisted ? "opacity-100 md:opacity-100 scale-105 text-gold-bright" : "hover:scale-105"
            }`}
            aria-label="Add to wishlist"
          >
            <Heart className={`h-4.5 w-4.5 transition-colors ${isWishlisted ? "fill-gold-bright text-gold-bright" : ""}`} />
          </button>

          {/* Quick Add CTA Slider */}
          <div className="absolute inset-x-0 bottom-0 z-30 overflow-hidden h-12 hidden md:block">
            <motion.button
              onClick={handleQuickAddClick}
              initial={{ y: "100%" }}
              animate={{ y: hovered ? 0 : "100%" }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="w-full h-full bg-white/95 backdrop-blur-xs text-espresso font-semibold uppercase tracking-widest text-xs hover:bg-gold hover:text-espresso transition-colors shadow-lg border-t border-gold/10"
            >
              Quick Add
            </motion.button>
          </div>

          {/* Mobile Quick Add (Always Visible at bottom right) */}
          <button
            onClick={handleQuickAddClick}
            className="absolute bottom-3 right-3 z-30 md:hidden bg-white/95 p-2 rounded-full border border-gold/10 text-xs font-semibold text-espresso uppercase tracking-widest"
          >
            + Add
          </button>
        </div>

        {/* Text Details Area */}
        <div className="p-4 flex-grow flex flex-col justify-between space-y-2.5">
          <div className="space-y-1">
            <h3 className="text-sm font-medium font-sans text-espresso group-hover:text-gold-bright transition-colors line-clamp-1">
              {product.name}
            </h3>
            <span className="text-[10px] text-espresso/75 uppercase tracking-wider font-semibold block">
              {product.category}
            </span>
          </div>

          <div className="flex flex-col space-y-1">
            <StarRating rating={product.rating} count={product.reviewCount} size="sm" />
            <div className="flex items-center gap-2 pt-1">
              <span className="text-sm font-bold text-espresso">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-sand/85 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>

      {/* Dialog for Quick Add */}
      {quickAddOpen && (
        <QuickAdd product={product} onClose={() => setQuickAddOpen(false)} />
      )}
    </>
  );
}

export default ProductCard;
