import { UserT } from "@/types/user.type";
import { useHotelBookingStore } from "@/store/useHotelBookingStore";
import React, { createContext, useContext, useState, ReactNode, Dispatch } from "react";

type UserContextType = {
  user: UserT | null;
  setUser: (user: UserT | null) => void;
  fetchWallet: boolean;
  setFetchWallet:Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [fetchWallet, setFetchWallet] = useState(false);
  const [user, setUser] = useState<UserT | null>(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); 
    // OWNER cost fields live in the persisted hotel store; reset() keeps lastReservation, so clear it too.
    useHotelBookingStore.getState().reset();
    useHotelBookingStore.getState().setLastReservation(null);
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, logout, fetchWallet, setFetchWallet }}
    >
      {children}
    </UserContext.Provider>
  );
}

// 🪝 Hook for easier usage
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside <UserProvider>");
  return ctx;
};
