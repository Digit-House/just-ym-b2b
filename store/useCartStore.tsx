import { CartItemT } from "@/types/cart.type";
import {
  ADD_TO_CART_ITEM_DATA_TYPE,
  ADD_TO_CART_USER_TYPE,
  AnswerT,
  EVENT_AVAILABLE_DATA_TYPE,
  GuestInfoT,
  SelectedProductOptionT,
} from "@/types/product.type";
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

  finalPackage: SelectedProductOptionT | null;
  setFinalPackage: (item: SelectedProductOptionT | null) => void;

  answerList: AnswerT[];
  setAnswerList: (item: AnswerT[]) => void;

  guestList: GuestInfoT[];
  setGuestList: (item: GuestInfoT[]) => void;

  step: number;
  setStep: (item: number) => void;

  variantStep: number;
  setVariantStep: (item: number) => void;

  eventList: EVENT_AVAILABLE_DATA_TYPE[];
  setEventList: (item: EVENT_AVAILABLE_DATA_TYPE[]) => void;

  addToCartCount: number;
  setAddToCartCount: (item: number) => void;

  selectedCartList: ADD_TO_CART_ITEM_DATA_TYPE[];
  setSelectedCartList: (item: ADD_TO_CART_ITEM_DATA_TYPE[]) => void;

  user: ADD_TO_CART_USER_TYPE;
  setUser: (user: ADD_TO_CART_USER_TYPE) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      finalPackage: null,
      setFinalPackage: (item) => set({ finalPackage: item }),

      answerList: [],
      setAnswerList: (item) => set({ answerList: item }),

      guestList: [],
      setGuestList: (item) => set({ guestList: item }),

      step: 1,
      setStep: (item) => set({ step: item }),

      variantStep: 1,
      setVariantStep: (item) => set({ variantStep: item }),

      eventList: [],
      setEventList: (item) => set({ eventList: item }),

      addToCartCount: 0,
      setAddToCartCount: (item) => set({ addToCartCount: item }),

      selectedCartList: [],
      setSelectedCartList: (item) => set({ selectedCartList: item }),

      user: {
        name: "",
        email: "",
        phone: "",
        sameAsLeader: false,
        leaderName: "",
        leaderEmail: "",
        leaderPhone: "",
      },

      setUser: (user: ADD_TO_CART_USER_TYPE) => set(() => ({ user })),

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
                          ? {
                              ...tt,
                              quantity: Math.max(0, tt.quantity + delta),
                            }
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
        get().items.filter((item) => get().selectedIds.includes(item.id)),

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
      onRehydrateStorage: () => (state: any) => {
        state._hasHydrated = true;
      },
      partialize: (state) => ({
        items: state.items,
        selectedIds: state.selectedIds,
        finalPackage: state.finalPackage,
        answerList: state.answerList,
        step: state.step,
        variantStep: state.variantStep,
        eventList: state.eventList,
        addToCartCount: state.addToCartCount,
        selectedCartList: state.selectedCartList,
        user: state.user,
      }),
    }
  )
);
