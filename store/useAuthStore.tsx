import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  token:string;
  setToken: (token: string) => void;
};

const useAuthStore = create<State>()(
  persist(
    (set) => ({
      token:"",
      setToken: (token) => set({ token: token }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
    },
  ),
);

export default useAuthStore;
