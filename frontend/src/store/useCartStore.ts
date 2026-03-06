import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  merchantId: string;
  quantity: number;
  price: number;
  name: string;
}

interface CartStoreState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, merchantId: string) => void;
  updateQuantity: (productId: string, merchantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const getItemKey = (productId: string, merchantId: string): string => `${productId}::${merchantId}`;

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingIndex = state.items.findIndex(
            (storedItem) => getItemKey(storedItem.productId, storedItem.merchantId) === getItemKey(item.productId, item.merchantId)
          );

          if (existingIndex === -1) {
            return { items: [...state.items, item] };
          }

          const nextItems = [...state.items];
          const existing = nextItems[existingIndex];
          nextItems[existingIndex] = {
            ...existing,
            quantity: existing.quantity + item.quantity
          };

          return { items: nextItems };
        }),
      removeItem: (productId, merchantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => getItemKey(item.productId, item.merchantId) !== getItemKey(productId, merchantId)
          )
        })),
      updateQuantity: (productId, merchantId, quantity) =>
        set((state) => ({
          items: state.items
            .map((item) => {
              if (getItemKey(item.productId, item.merchantId) !== getItemKey(productId, merchantId)) {
                return item;
              }

              return {
                ...item,
                quantity
              };
            })
            .filter((item) => item.quantity > 0)
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }),
    {
      name: "saleh-zone-cart"
    }
  )
);
