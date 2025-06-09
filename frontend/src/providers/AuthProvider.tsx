import { useEffect, useState } from "react";
import { AuthContext } from "../contexts/authContext";
import { jwtDecode } from "jwt-decode";
import { checkIfUserIsAdmin } from "../api/requests/user";


export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [signedIn, setSignedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if(!token) {
      setLoadingAuth(false);
      return;
    }

    try {
      const decodedToken: { isAdmin?: boolean; exp: number } = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp <= currentTime) {
        signOut();
        return;  
      }

      setSignedIn(true);
      setIsAdmin(!!decodedToken.isAdmin);
    } catch (err) {
      console.error("Failed to decode or validate JWT:", err);
      signOut();
    }

    setLoadingAuth(false);
  }, []);

  const signIn = (token: string) => {
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
  }

  const signOut = () => {
    localStorage.removeItem("jwtToken");
    setSignedIn(false);
    setIsAdmin(false);
  }

  const checkIsAdmin = async (): Promise<void> => {
    setLoadingAuth(true);

    try {
      setIsAdmin(await checkIfUserIsAdmin(localStorage.getItem("jwtToken")));
      setLoadingAuth(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <AuthContext.Provider value={{signedIn, isAdmin, loadingAuth, signIn, signOut, checkIsAdmin}}>
      {children}
    </AuthContext.Provider>
  )
}
