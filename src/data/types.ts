/**
 * Product Data Interface
 * Strict typing for premium e-commerce jewellery catalog items.
 */
export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  shortName: string;
  category:
    | "Bracelets"
    | "Chains & Pendants"
    | "Earrings"
    | "Rings"
    | "Men"
    | "Premium"
    | "Watch Charms";
  collection:
    | "Gold Collection"
    | "92.5 Sterling Silver";
  metal:
    | "Gold Plated"
    | "92.5 Sterling Silver";
  purity: string;
  image: string;
  gallery?: string[];
  price: number;
  originalPrice?: number;
  discount: number;
  badge?:
    | "Flash Sale"
    | "Best Seller"
    | "New"
    | "Limited"
    | "Sold Out";
  featured: boolean;
  bestseller: boolean;
  flashSale: boolean;
  newArrival: boolean;
  inStock: boolean;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  material: string;
  weight: string;
  dimensions?: string;
  occasion: string[];
  tags: string[];
  createdAt: string;
}
