"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/Sheet";
import { useMounted } from "@/hooks/useMounted";

/**
 * CartDrawer Component
 * Displays a slide-out shopping cart drawer using the custom Sheet component.
 * Allows quantity changes, removing items, and checkout initiation.
 */
export function CartDrawer() {
  const { items, isOpen, toggleOpen, updateQuantity, removeItem } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();
  const mounted = useMounted();

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!mounted) return null;

  return (
    <Sheet open={isOpen} onOpenChange={toggleOpen}>
      <SheetContent side="right" className="w-full max-w-[400px] bg-offwhite p-0 flex flex-col h-full z-50">
        
        {/* Header */}
        <SheetHeader className="p-6 border-b border-gold/10">
          <SheetTitle className="flex items-center gap-2 text-espresso tracking-wider font-semibold uppercase text-sm">
            <ShoppingBag className="h-5 w-5 text-gold" />
            Your Shopping Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-cream p-4 rounded-full text-sand">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <div>
                <p className="text-espresso font-semibold text-lg">Your bag is empty</p>
                <p className="text-sand text-sm mt-1">Add some beautiful silver jewellery to start.</p>
              </div>
              <Link
                href="/shop"
                onClick={() => toggleOpen()}
                className="mt-4 bg-espresso text-cream hover:bg-espresso/90 text-xs font-semibold uppercase tracking-widest px-6 py-3 rounded-pill transition-colors shadow-xs"
              >
                Start Shopping &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 pb-6 border-b border-gold/10 last:border-b-0">
                  {/* Product Image */}
                  <div className="relative h-20 w-20 overflow-hidden rounded-card bg-cream flex-shrink-0 border border-gold/10">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>

                  {/* Product Info & Controls */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between gap-2">
                        <h4 className="text-sm font-medium text-espresso line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.product.id, item.size)}
                          className="text-sand hover:text-red-650 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-xs text-sand uppercase tracking-wider mt-0.5">
                        {item.product.category}
                      </p>
                      {item.size && (
                        <p className="text-[10px] text-gold font-bold uppercase tracking-wider mt-0.5">
                          Size: {item.size}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Qty Stepper */}
                      <div className="flex items-center border border-gold/30 rounded-pill bg-white px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                          className="text-espresso hover:text-gold-bright p-1"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-semibold px-3 text-espresso">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                          className="text-espresso hover:text-gold-bright p-1"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Item Price */}
                      <span className="text-sm font-semibold text-espresso">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Checkout) */}
        {items.length > 0 && (
          <div className="border-t border-gold/10 p-6 bg-white space-y-4 shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center text-base font-semibold">
              <span className="text-espresso uppercase tracking-wider text-sm">Subtotal</span>
              <span className="text-espresso font-display text-lg">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-[11px] text-sand leading-normal">
              Tax and shipping will be calculated at checkout.
            </p>
            <button
              onClick={() => {
                toggleOpen();
                if (!isLoggedIn) {
                  router.push("/login?redirect=/checkout");
                } else {
                  router.push("/checkout");
                }
              }}
              className="w-full bg-gold hover:bg-gold-light text-espresso font-semibold uppercase tracking-widest text-xs py-4 rounded-pill transition-colors flex items-center justify-center shadow-md"
            >
              Checkout
            </button>
          </div>
        )}

      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
