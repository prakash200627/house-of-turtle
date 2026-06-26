import { Product } from "./product";

/**
 * CartItem Interface
 * Represents an item in the shopping cart.
 */
export interface CartItem {
  product: Product;
  quantity: number;
}

/**
 * CartState Interface
 * Defines state variables and actions for the cart store.
 */
export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, qty: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleOpen: () => void;
}
