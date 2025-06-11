import { useEffect, useState } from "react";
import { UserInfoContext } from "../contexts/userInfoContext";
import { User } from "../classes/user";
import { getUserInfo, updateUserInfo } from "../api/requests/user";

export function UserInfoProvider({ children }: { children: React.ReactNode }) {
  const [userInfo, setUserInfo] = useState<User>();
  const [userLoading, setUserLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getUser() {
      try {
        setUserInfo(await getUserInfo(localStorage.getItem("jwtToken")));
        setUserLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    getUser();
  }, []);

  const useUserInfo = (): User => {
    if (!userInfo) {
      throw new Error("userInfo is undefined");
    }

    return userInfo;
  };

  const updateUser = (
    jwtToken: string | null,
    firstName: string,
    secondName: string,
    email: string,
    phoneNumber: string,
  ): void => {
    async function update() {
      try {
        setUserInfo(await updateUserInfo(jwtToken, firstName, secondName, email, phoneNumber));
      } catch (error) {
        console.log(error);
      }
    }

    update();
  };

  return (
    <UserInfoContext.Provider value={{ userLoading, useUserInfo, updateUser }}>
      {children}
    </UserInfoContext.Provider>
  );
}
