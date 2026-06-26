"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Check, ShoppingBag } from "lucide-react";
import { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";

interface QuickAddProps {
  product: Product;
  onClose: () => void;
}

/**
 * QuickAdd Component
 * Opens a Dialog showing basic item details.
 * Adds item to cart, triggers success state, and auto-closes.
 */
export function QuickAdd({ product, onClose }: QuickAddProps) {
  const [added, setAdded] = useState(false);
  const cartStore = useCartStore();

  const handleAddToCart = () => {
    setAdded(true);
    cartStore.addItem(product, 1);
    
    // Success feedback and auto close
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-[450px] bg-offwhite p-6 rounded-xl border border-gold/10 shadow-2xl">
        <DialogHeader className="border-b border-gold/10 pb-4 mb-4">
          <DialogTitle className="text-espresso font-display font-semibold uppercase text-xs tracking-widest text-left">
            Quick Add to Bag
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          {/* Left: Product Image */}
          <div className="relative h-28 w-28 overflow-hidden rounded-card bg-cream border border-gold/10 flex-shrink-0">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="112px"
              className="object-cover"
              unoptimized={true}
            />
          </div>

          {/* Right: Info & CTA */}
          <div className="flex-1 flex flex-col justify-between py-1">
            <div className="space-y-1">
              <span className="text-[10px] text-sand uppercase tracking-wider font-bold">
                {product.category}
              </span>
              <h3 className="text-sm font-semibold text-espresso font-sans leading-snug">
                {product.name}
              </h3>
              <p className="text-sm font-bold text-gold mt-1">
                {formatPrice(product.price)}
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full font-semibold uppercase tracking-widest text-[10px] py-3 rounded-pill transition-colors duration-120 flex items-center justify-center gap-2 mt-4 shadow-sm ${
                added
                  ? "bg-green-600 text-white cursor-default"
                  : "bg-gold hover:bg-gold-light text-espresso"
              }`}
            >
              {added ? (
                <>
                  <Check className="h-4.5 w-4.5" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuickAdd;
