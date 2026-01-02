import { CartItemT } from "@/types/cart.type";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  items: CartItemT[];
  selectedIds: string[];

  addItem: (item: CartItemT) => void;
  removeItem: (id: string) => void;
  updateQuantity: (itemId: string, ticketTypeId: string, delta: number) => void;
  clearCart: () => void;

  toggleSelect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;

  getTotal: () => number;
  getSelectedItems: () => CartItemT[];
  getSelectedTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedIds: [],

      addItem: (newItem) => {
        set((state) => ({
          items: [...state.items, newItem],
          selectedIds: [...state.selectedIds, newItem.id], // auto-select
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          selectedIds: state.selectedIds.filter((sid) => sid !== id),
        }));
      },

      updateQuantity: (itemId, ticketTypeId, delta) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === itemId
                ? {
                    ...item,
                    ticketTypes: item.ticketTypes
                      .map((tt) =>
                        tt.id === ticketTypeId
                          ? { ...tt, quantity: Math.max(0, tt.quantity + delta) }
                          : tt
                      )
                      .filter((tt) => tt.quantity > 0),
                  }
                : item
            )
            .filter((item) => item.ticketTypes.length > 0),
        }));
      },

      clearCart: () => set({ items: [], selectedIds: [] }),

      toggleSelect: (id) => {
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((sid) => sid !== id)
            : [...state.selectedIds, id],
        }));
      },

      selectAll: () => {
        const ids = get().items.map((i) => i.id);
        set({ selectedIds: ids });
      },

      clearSelection: () => set({ selectedIds: [] }),

      getTotal: () =>
        get().items.reduce(
          (total, item) =>
            total +
            item.ticketTypes.reduce(
              (sum, tt) => sum + tt.price * tt.quantity,
              0
            ),
          0
        ),

      getSelectedItems: () =>
        get().items.filter((item) =>
          get().selectedIds.includes(item.id)
        ),

      getSelectedTotal: () =>
        get()
          .getSelectedItems()
          .reduce(
            (total, item) =>
              total +
              item.ticketTypes.reduce(
                (sum, tt) => sum + tt.price * tt.quantity,
                0
              ),
            0
          ),
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        selectedIds: state.selectedIds,
      }),
    }
  )
);
