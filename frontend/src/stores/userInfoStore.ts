import { create } from "zustand";
import type { User } from "../classes/user";
import { getUserInfo, updateUserInfo } from "../api/requests/user";

interface UserInfoState {
  userInfo: User | undefined;
  userLoading: boolean;
  updateUser: (
    firstName: string,
    secondName: string,
    email: string,
    phoneNumber: string,
  ) => Promise<void>;
  initializeUserInfo: () => Promise<void>;
}

const useUserInfoStore = create<UserInfoState>((set) => ({
  userInfo: undefined,
  userLoading: true,

  updateUser: async (
    firstName: string,
    secondName: string,
    email: string,
    phoneNumber: string,
  ): Promise<void> => {
    try {
      const updatedUserInfo: User = await updateUserInfo(firstName, secondName, email, phoneNumber);
      set({ userInfo: updatedUserInfo });
    } catch (error) {
      console.log(error);
    }
  },

  initializeUserInfo: async (): Promise<void> => {
    try {
      const intialUserInfo: User = await getUserInfo();
      set({ userInfo: intialUserInfo, userLoading: false });
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useUserInfo = (): User => {
  const info = useUserInfoStore((state) => state.userInfo);

  if (!info) {
    throw new Error("userInfo is undefined");
  }

  return info;
};

export const useUserLoading = (): boolean => useUserInfoStore((state) => state.userLoading);

export const useUpdateUser = (): ((
  firstName: string,
  secondName: string,
  email: string,
  phoneNumber: string,
) => Promise<void>) => useUserInfoStore((state) => state.updateUser);

export const useIntializeUserInfo = (): (() => Promise<void>) =>
  useUserInfoStore((state) => state.initializeUserInfo);
