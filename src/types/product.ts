/**
 * Product Interface
 * Represents a premium jewellery product item.
 */
import { Product as BaseProduct } from "@/data/types";

export interface Product extends BaseProduct {
  gender: "men" | "women";
  // Compatibility fields for existing frontend UI code
  images: string[];
  reviewCount: number;
}
