import { CartItemT } from "@/types/cart.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItemT[];
  addItem: (item: CartItemT) => void;
  removeItem: (id: string) => void;
  updateQuantity: (itemId: string, ticketTypeId: string, delta: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        set((state) => {
          // Logic to merge if same product and same date
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId && item.date === newItem.date
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingItemIndex];

            // Merge ticket types
            newItem.ticketTypes.forEach((newTt) => {
              const existingTt = existingItem.ticketTypes.find(
                (tt) => tt.id === newTt.id
              );
              if (existingTt) {
                existingTt.quantity += newTt.quantity;
              } else {
                existingItem.ticketTypes.push({ ...newTt });
              }
            });

            return { items: updatedItems };
          }

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (itemId, ticketTypeId, delta) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id === itemId) {
                return {
                  ...item,
                  ticketTypes: item.ticketTypes
                    .map((tt) => {
                      if (tt.id === ticketTypeId) {
                        return {
                          ...tt,
                          quantity: Math.max(0, tt.quantity + delta),
                        };
                      }
                      return tt;
                    })
                    .filter((tt) => tt.quantity > 0),
                };
              }
              return item;
            })
            .filter((item) => item.ticketTypes.length > 0),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          return (
            total +
            item.ticketTypes.reduce(
              (sum, tt) => sum + tt.price * tt.quantity,
              0
            )
          );
        }, 0);
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
