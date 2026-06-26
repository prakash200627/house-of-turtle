import { Product } from "./product";

/**
 * CartItem Interface
 * Represents an item in the shopping cart.
 */
export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

/**
 * CartState Interface
 * Defines state variables and actions for the cart store.
 */
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, qty: number, size?: string) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, qty: number, size?: string) => void;
  clearCart: () => void;
  toggleOpen: () => void;
}
