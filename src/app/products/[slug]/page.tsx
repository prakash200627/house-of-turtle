"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { formatPrice } from "@/lib/utils";
import { StarRating } from "@/components/common/StarRating";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { Plus, Minus, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, ZoomIn } from "lucide-react";
import { SizeGuideModal, PincodeChecker, ImageLightbox } from "@/components/product";
import { motion } from "framer-motion";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();

  // Safely extract string slug
  const resolvedSlug = typeof slug === "string" ? slug : Array.isArray(slug) ? slug[0] : undefined;

  // Find product by slug
  const product = products.find((p) => p.slug === resolvedSlug);

  const cartStore = useCartStore();
  const wishlistStore = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // New PDP States
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [shake, setShake] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <span className="text-xs text-sand font-bold uppercase tracking-widest mb-3">404 Error</span>
        <h2 className="font-display text-3xl font-semibold text-espresso mb-4">Product Not Found</h2>
        <p className="text-sand/80 font-light text-sm max-w-md mx-auto mb-8 leading-relaxed font-sans">
          The jewellery piece you are looking for does not exist or has been discontinued.
        </p>
        <Link href="/shop" className="bg-espresso text-cream px-8 py-3.5 rounded-pill text-xs font-semibold uppercase tracking-widest hover:bg-espresso/90 shadow-sm">
          Explore Catalogue
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistStore.productIds.includes(product.id);

  // Filter 4 related products in the same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Badge configuration
  const badgeVariant =
    product.badge === "Flash Sale" ? "sale" :
    product.badge === "New" ? "new" :
    product.badge === "Limited" || product.badge === "Sold Out" ? "low-stock" : "gold";

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setSizeError(false);
    cartStore.addItem(product, quantity, selectedSize);
  };

  const handleWishlistToggle = () => {
    wishlistStore.toggleWishlist(product.id);
  };

  return (
    <div className="bg-offwhite min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-[10px] sm:text-xs md:text-sm font-semibold text-sand uppercase tracking-wider mb-8 select-none flex flex-wrap gap-1.5 items-center">
          <Link href="/" className="hover:text-espresso transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-espresso transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/${product.metal === "Gold Plated" ? "gold" : "silver"}`} className="hover:text-espresso transition-colors">
            {product.metal}
          </Link>
          <span>/</span>
          <span className="text-espresso font-bold truncate max-w-xs">{product.shortName}</span>
        </nav>

        {/* Product Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20 bg-white border border-gold/10 rounded-card p-6 sm:p-8 lg:p-12 shadow-card">
          
          {/* Left Column: Image Gallery (5 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image */}
            <div
              onClick={() => setLightboxOpen(true)}
              className="relative aspect-square w-full rounded-card overflow-hidden bg-cream border border-gold/15 shadow-inner cursor-zoom-in group/image"
              title="Click to zoom"
            >
              <Image
                src={product.images[activeImageIdx] || product.image}
                alt={product.name}
                fill
                sizes="(max-w-768px) 100vw, 40vw"
                priority={true}
                className="object-cover"
                unoptimized={true}
              />
              
              {/* ZoomIn Icon overlay */}
              <div className="absolute bottom-4 right-4 bg-white/85 p-2 rounded-full border border-gold/25 text-espresso shadow-md opacity-75 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-4 w-4" />
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-12 right-4 bg-espresso/90 text-cream text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded shadow-md opacity-0 group-hover/image:opacity-100 transition-opacity duration-150 pointer-events-none border border-gold/15">
                Click to zoom
              </div>
              
              {product.badge && (
                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                  <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-sm shadow-xs border ${
                    badgeVariant === "sale" ? "bg-red-50 text-red-600 border-red-200" :
                    badgeVariant === "new" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                    badgeVariant === "low-stock" ? "bg-amber-50 text-amber-600 border-amber-200" :
                    "bg-gold text-espresso border-gold/10"
                  }`}>
                    {product.badge}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto no-scrollbar py-1.5">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative h-16 w-16 rounded border flex-shrink-0 overflow-hidden transition-all bg-cream ${
                      activeImageIdx === idx ? "border-gold border-2 shadow-sm" : "border-gold/15 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                      unoptimized={true}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Spec / Cart Actions (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div className="space-y-2 border-b border-gold/10 pb-4">
              <span className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest text-sand">
                {product.metal} &bull; {product.category}
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-espresso leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <StarRating rating={product.rating} count={product.reviewCount} size="md" />
                <span className="text-xs md:text-sm text-sand font-medium">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-display font-bold text-gold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-sm md:text-base text-sand line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-[10px] md:text-xs text-sand font-medium uppercase tracking-wider">Inclusive of all taxes & PAN India Shipping</p>
            </div>

            {/* Description */}
            <div className="space-y-2 text-xs sm:text-sm md:text-base text-sand font-light leading-relaxed font-sans">
              <p>{product.description}</p>
            </div>

            {/* Size Selector Section */}
            <motion.div
              animate={shake ? { x: [0, 10, -10, 10, -10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className="space-y-3 pt-4 border-t border-gold/10"
            >
              <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
                <span className="text-espresso">Select Size</span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-gold hover:text-gold-light transition-colors normal-case font-bold cursor-pointer"
                >
                  Size Guide &rarr;
                </button>
              </div>

              <div className="flex gap-3">
                {[
                  { label: "S (16cm)", value: "S" },
                  { label: "M (18cm)", value: "M" },
                  { label: "L (20cm)", value: "L", disabled: true },
                ].map((sizeOpt) => (
                  <button
                    key={sizeOpt.value}
                    disabled={sizeOpt.disabled}
                    onClick={() => {
                      setSelectedSize(sizeOpt.value);
                      setSizeError(false);
                    }}
                    className={`px-5 py-2.5 border text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                      sizeOpt.disabled
                        ? "border-sand/20 text-sand/40 opacity-40 cursor-not-allowed line-through"
                        : selectedSize === sizeOpt.value
                        ? "bg-espresso border-espresso text-cream"
                        : "bg-white border-sand/35 text-sand hover:border-espresso hover:text-espresso"
                    }`}
                  >
                    {sizeOpt.label}
                  </button>
                ))}
              </div>

              {sizeError && (
                <p className="text-[12px] text-red-500 font-semibold pl-1">
                  Please select a size
                </p>
              )}
            </motion.div>

            {/* Add to Cart Actions */}
            <div className="space-y-4 pt-4 border-t border-gold/10">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                
                {/* Quantity picker */}
                {product.inStock && (
                  <div className="flex items-center border border-gold/30 rounded-pill bg-white overflow-hidden w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-espresso hover:text-gold-bright transition-colors flex-grow sm:flex-grow-0"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-xs md:text-sm font-semibold select-none text-espresso">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 text-espresso hover:text-gold-bright transition-colors flex-grow sm:flex-grow-0"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {/* Main Action buttons */}
                {product.inStock ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 bg-gold hover:bg-gold-light text-espresso font-semibold py-4 md:py-4.5 rounded-pill transition-all shadow-md flex items-center justify-center gap-2 uppercase tracking-widest text-xs md:text-sm"
                  >
                    <ShoppingBag className="h-4.5 w-4.5" />
                    <span>Add to Shopping Bag</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full sm:flex-1 bg-sand/20 text-sand/60 font-semibold py-4 md:py-4.5 rounded-pill flex items-center justify-center gap-2 uppercase tracking-widest text-xs md:text-sm cursor-not-allowed border border-gold/5"
                  >
                    <span>Sold Out</span>
                  </button>
                )}

                {/* Wishlist toggle */}
                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-full border border-gold/25 transition-all shadow-xs ${
                    isWishlisted ? "bg-gold-bright border-gold-bright text-espresso scale-105" : "bg-white text-espresso hover:text-gold-bright"
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart className={`h-4.5 w-4.5 ${isWishlisted ? "fill-espresso" : ""}`} />
                </button>

              </div>
            </div>

            {/* Pincode Checker */}
            <PincodeChecker />

            {/* Spec details card list */}
            <div className="bg-cream/25 border border-gold/10 rounded-md p-5 space-y-4">
              <h4 className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-espresso border-b border-gold/10 pb-1.5">
                Product Details
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs md:text-sm font-sans text-sand">
                <div>
                  <span className="font-semibold text-espresso block">Metal Purity</span>
                  <span>{product.purity} &bull; {product.metal}</span>
                </div>
                <div>
                  <span className="font-semibold text-espresso block">Estimated Weight</span>
                  <span>{product.weight}</span>
                </div>
                <div>
                  <span className="font-semibold text-espresso block">Material</span>
                  <span>{product.material}</span>
                </div>
                {product.dimensions && (
                  <div>
                    <span className="font-semibold text-espresso block">Dimensions</span>
                    <span>{product.dimensions}</span>
                  </div>
                )}
                <div className="col-span-2">
                  <span className="font-semibold text-espresso block">Designed for Occasions</span>
                  <span className="capitalize">{product.occasion.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-gold/10 select-none text-center">
              <div className="flex flex-col items-center p-2 rounded bg-cream/10 border border-gold/5">
                <Truck className="h-8 w-8 text-gold mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-espresso">PAN India Free Ship</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-cream/10 border border-gold/5">
                <ShieldCheck className="h-8 w-8 text-gold mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-espresso">92.5 Certified</span>
              </div>
              <div className="flex flex-col items-center p-2 rounded bg-cream/10 border border-gold/5">
                <RefreshCw className="h-8 w-8 text-gold mb-1" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-espresso">30-Day Returns</span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Related items */}
        {relatedProducts.length > 0 && (
          <section className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sand">Recommendations</span>
              <h3 className="font-display text-2xl font-bold text-espresso">You May Also Like</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Lightbox / Modals */}
        <SizeGuideModal open={sizeGuideOpen} onOpenChange={setSizeGuideOpen} />
        
        <ImageLightbox
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          images={product.images}
          activeIndex={activeImageIdx}
          setActiveIndex={setActiveImageIdx}
        />

      </div>
    </div>
  );
}
