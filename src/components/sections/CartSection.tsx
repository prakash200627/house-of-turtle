"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { formatPrice } from "@/lib/utils";

/**
 * CartSection Component
 * Displays the cart checklist, item quantities, subtotal, and free shipping tracker.
 */
export function CartSection() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingThreshold = 999; // Updated to match free shipping threshold ₹999
  const isFreeShipping = subtotal >= shippingThreshold;
  const shippingCost = isFreeShipping ? 0 : 99; // Shipping cost in INR
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <section className="py-24 max-w-3xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-cream rounded-full text-sand">
            <ShoppingBag className="h-12 w-12" />
          </div>
        </div>
        <h2 className="font-display text-3xl font-semibold text-espresso mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-sand font-light mb-8 max-w-md mx-auto text-sm font-sans">
          It looks like you haven&apos;t added any handcrafted silver jewellery yet.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-espresso text-cream font-medium px-8 py-3.5 rounded-pill hover:bg-espresso/90 transition-colors shadow-sm text-xs uppercase tracking-widest"
        >
          Explore Catalogue
        </Link>
      </section>
    );
  }

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-offwhite">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-espresso mb-10">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Threshold Progress */}
          <div className="bg-white border border-gold/10 rounded-xl p-5 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-espresso mb-3">
              {isFreeShipping ? (
                <span className="text-emerald-600">🎉 You have unlocked free shipping!</span>
              ) : (
                <span>
                  Add <strong className="text-gold">{formatPrice(shippingThreshold - subtotal)}</strong> more for free shipping.
                </span>
              )}
            </p>
            <div className="w-full bg-cream h-2 rounded-full overflow-hidden">
              <div
                className="bg-gold h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          <div className="divide-y divide-gold/10 bg-white border border-gold/10 rounded-xl overflow-hidden shadow-xs">
            {items.map((item) => (
              <div key={item.product.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="relative h-20 w-20 rounded-card overflow-hidden bg-cream flex-shrink-0 border border-gold/10">
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sand">
                      {item.product.category}
                    </span>
                    <h3 className="font-sans text-sm font-semibold text-espresso mt-0.5">
                      {item.product.name}
                    </h3>
                    {item.size && (
                      <p className="text-[10px] text-gold font-bold uppercase tracking-wider mt-0.5">
                        Size: {item.size}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-gold mt-1">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
                  <div className="flex items-center border border-gold/30 rounded-pill bg-white overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}
                      className="p-2 text-espresso hover:text-gold-bright transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-xs font-semibold select-none text-espresso">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}
                      className="p-2 text-espresso hover:text-gold-bright transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id, item.size)}
                    className="p-2 text-sand hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-white border border-gold/10 rounded-xl p-6 space-y-6 shadow-xs">
          <h2 className="font-display text-2xl font-semibold text-espresso border-b border-gold/10 pb-4">
            Order Summary
          </h2>

          <div className="space-y-4 text-xs font-semibold uppercase tracking-wider">
            <div className="flex justify-between text-sand">
              <span>Subtotal</span>
              <span className="font-display text-base text-espresso normal-case font-bold">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sand">
              <span>Shipping</span>
              <span className="text-espresso">
                {isFreeShipping ? "Free" : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-semibold text-espresso pt-4 border-t border-gold/10">
              <span>Total</span>
              <span className="font-display text-lg text-gold font-bold">{formatPrice(total)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              if (!isLoggedIn) {
                router.push("/login?redirect=/checkout");
              } else {
                router.push("/checkout");
              }
            }}
            className="w-full bg-gold hover:bg-gold-light text-espresso font-semibold py-4 rounded-pill transition-colors shadow-md tracking-widest uppercase text-xs"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </section>
  );
}

export default CartSection;
