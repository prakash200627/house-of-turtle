import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

interface User {
  name: string;
  email: string;
  image?: string;
  addresses?: Address[];
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (name: string, email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

/**
 * Zustand authentication store
 * Manages user login state and persists to localStorage.
 * Manages user addresses client-side.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,

      login: (name: string, email: string) => {
        set((state) => {
          const existingAddresses =
            state.user?.email === email ? state.user.addresses || [] : [];
          return {
            isLoggedIn: true,
            user: { name, email, addresses: existingAddresses },
          };
        });
      },

      register: (name: string, email: string) => {
        set({ isLoggedIn: true, user: { name, email, addresses: [] } });
      },

      logout: () => {
        set({ isLoggedIn: false, user: null });
      },

      addAddress: (address) => {
        set((state) => {
          if (!state.user) return {};
          const currentAddresses = state.user.addresses || [];
          const newAddress: Address = {
            ...address,
            id: "addr-" + Math.floor(100000 + Math.random() * 900000),
            isDefault:
              currentAddresses.length === 0
                ? true
                : address.isDefault || false,
          };

          let updated = [...currentAddresses];
          if (newAddress.isDefault) {
            updated = updated.map((a) => ({ ...a, isDefault: false }));
          }
          updated.push(newAddress);

          return {
            user: {
              ...state.user,
              addresses: updated,
            },
          };
        });
      },

      removeAddress: (id) => {
        set((state) => {
          if (!state.user) return {};
          const currentAddresses = state.user.addresses || [];
          const updated = currentAddresses.filter((a) => a.id !== id);
          // If we deleted the default, set first remaining as default
          if (updated.length > 0 && !updated.some((a) => a.isDefault)) {
            updated[0].isDefault = true;
          }
          return {
            user: {
              ...state.user,
              addresses: updated,
            },
          };
        });
      },

      setDefaultAddress: (id) => {
        set((state) => {
          if (!state.user) return {};
          const currentAddresses = state.user.addresses || [];
          const updated = currentAddresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          }));
          return {
            user: {
              ...state.user,
              addresses: updated,
            },
          };
        });
      },
    }),
    {
      name: "house-of-turtles-auth",
    }
  )
);

export default useAuthStore;
