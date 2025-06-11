import { createContext, useContext } from "react";
import type { User } from "../classes/user";

type UserListContextType = {
  userList: User[];
  setUserList: React.Dispatch<React.SetStateAction<User[]>>;
};

export const UserListContext: React.Context<UserListContextType | undefined> =
  createContext<UserListContextType | undefined>(undefined);

export const useUserListContext = (): UserListContextType => {
  const context = useContext(UserListContext);
  if (context === undefined) {
    throw new Error("useUserListContext must be used within a CartProvider");
  }
  return context;
};
