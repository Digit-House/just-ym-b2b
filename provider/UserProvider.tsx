import { UserT } from "@/types/user.type";
import { createContext, useContext, useState, ReactNode } from "react";


type UserContextType = {
  user: UserT | null;
  setUser: (user: UserT | null) => void;
  logout: () => void;
};

// 👇 default empty context
const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserT | null>(null);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");  // optional
  };

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
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
