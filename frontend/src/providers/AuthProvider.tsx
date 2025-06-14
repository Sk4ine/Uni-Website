import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import { jwtDecode } from "jwt-decode";
import { checkIfUserIsAdmin, handleLogout } from "../api/requests/user";
import { setLogoutCallback } from "../api/requests/axiosInstance";
import type { JWTTokenResponse } from "../api/responses/apiResponses";
import type { AxiosResponse } from "axios";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  const signOut = useCallback(() => {
    async function logOut() {
      try {
        await handleLogout();
        localStorage.removeItem("jwtToken");
        setSignedIn(false);
        setIsAdmin(false);
        setLoadingAuth(false);
      } catch (error) {
        console.log("Logout failed: " + error);
      }
    }

    logOut();
  }, []);

  const signIn = useCallback((token: string) => {
    localStorage.setItem("jwtToken", token);

    try {
      const decodedToken: { isAdmin?: boolean; exp: number } = jwtDecode(token);
      setSignedIn(true);
      setIsAdmin(!!decodedToken.isAdmin);
    } catch (err) {
      console.error("Failed to decode token on sign-in:", err);
      setSignedIn(false);
      setIsAdmin(false);
    }
  }, []);

  const checkIsAdmin = useCallback(async (): Promise<void> => {
    setLoadingAuth(true);

    try {
      setIsAdmin(await checkIfUserIsAdmin());
      setLoadingAuth(false);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const response: AxiosResponse<JWTTokenResponse> = await axios.get<JWTTokenResponse>(
        `${API_BASE_URL}/api/auth/refresh-token`,
        {
          withCredentials: true,
        },
      );

      if (response) {
        const decodedToken: { isAdmin?: boolean; exp: number } = jwtDecode(response.data.token);

        localStorage.setItem("jwtToken", response.data.token);

        setSignedIn(true);
        setIsAdmin(!!decodedToken.isAdmin);
      } else {
        localStorage.setItem("jwtToken", "");
      }

      setLoadingAuth(false);
    } catch (error) {
      console.log(error);
      signOut();
    }
  }, [signOut]);

  useEffect(() => {
    setLogoutCallback(signOut);
    refreshToken();
  }, [signOut, refreshToken]);

  return (
    <AuthContext.Provider value={{ signedIn, isAdmin, loadingAuth, signIn, signOut, checkIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}
