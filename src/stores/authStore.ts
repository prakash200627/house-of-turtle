import { create } from "zustand";
import { persist } from "zustand/middleware";
import { signOut } from "next-auth/react";

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
  status: "loading" | "authenticated" | "unauthenticated";
  setSession: (session: any, status: "loading" | "authenticated" | "unauthenticated") => void;
  signOut: () => Promise<void>;
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

/**
 * Zustand authentication store
 * Integrates NextAuth session data and manages user addresses.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      status: "loading",

      setSession: (session, status) => {
        set((state) => {
          const authUser = session?.user
            ? {
                name: session.user.name || "",
                email: session.user.email || "",
                image: session.user.image || "",
                addresses: state.user?.addresses || [],
              }
            : null;

          return {
            status,
            isLoggedIn: status === "authenticated",
            user: authUser,
          };
        });
      },

      signOut: async () => {
        await signOut({ redirect: true, callbackUrl: "/" });
        set({ isLoggedIn: false, user: null, status: "unauthenticated" });
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
