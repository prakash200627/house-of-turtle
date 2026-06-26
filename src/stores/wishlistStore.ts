import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: string[];
  toggleWishlist: (id: string) => void;
}

/**
 * Zustand wishlist store
 * Manages wishlist ids array with local storage persistence.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],

      toggleWishlist: (id: string) => {
        set((state) => {
          const exists = state.productIds.includes(id);
          const updatedIds = exists
            ? state.productIds.filter((item) => item !== id)
            : [...state.productIds, id];
          return { productIds: updatedIds };
        });
      },
    }),
    {
      name: "house-of-turtles-wishlist",
    }
  )
);

export default useWishlistStore;
