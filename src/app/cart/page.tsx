import React from "react";
import { CartSection } from "@/components/sections/CartSection";

/**
 * Shopping Cart Page
 * Renders the checkout listing of items. Inherits Header/Footer from layout.
 */
export default function CartPage() {
  return (
    <div className="w-full bg-offwhite py-8">
      <CartSection />
    </div>
  );
}
