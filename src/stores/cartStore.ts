import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartState, Product, CartItem } from "../types";

/**
 * Zustand cart store
 * Manages shopping cart array and sliding drawer open state.
 * Persists data to localStorage.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (product: Product, qty: number) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += qty;
            return { items: updatedItems, isOpen: true }; // Open cart drawer on add
          }

          return { items: [...state.items, { product, quantity: qty }], isOpen: true };
        });
      },

      removeItem: (id: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== id),
        }));
      },

      updateQuantity: (id: string, qty: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === id
              ? { ...item, quantity: Math.max(1, qty) }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: "house-of-turtles-cart",
    }
  )
);
export default useCartStore;
