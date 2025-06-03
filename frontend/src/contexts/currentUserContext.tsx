import { createContext, useContext } from "react";
import type { User } from "../classes/user";

type CurrentUserContextType = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const CurrentUserContext: React.Context<CurrentUserContextType | undefined> = createContext<CurrentUserContextType | undefined>(undefined);

export const useCurrentUserContext = (): CurrentUserContextType => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUserContext must be used within a CartProvider');
  }
  return context;
};