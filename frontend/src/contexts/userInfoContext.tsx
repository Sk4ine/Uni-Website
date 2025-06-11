import { createContext, useContext } from "react";
import type { User } from "../classes/user";

interface UserInfoContextType {
  userLoading: boolean;
  useUserInfo: () => User;
  updateUser: (
    jwtToken: string | null,
    firstName: string,
    secondName: string,
    email: string,
    phoneNumber: string,
  ) => void;
}

export const UserInfoContext: React.Context<UserInfoContextType | undefined> = createContext<
  UserInfoContextType | undefined
>(undefined);

export const useUserInfoContext = (): UserInfoContextType => {
  const context = useContext(UserInfoContext);
  if (context === undefined) {
    throw new Error("useUserInfoContext must be used within a UserInfoProvider");
  }
  return context;
};
