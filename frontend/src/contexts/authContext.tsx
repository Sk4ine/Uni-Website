import { createContext, useContext } from "react";

interface AuthContextType {
  signedIn: boolean;
  isAdmin: boolean;
  loadingAuth: boolean;
  signIn: (token: string) => void;
  signOut: () => void;
  checkIsAdmin: () => Promise<void>;
}

export const AuthContext: React.Context<AuthContextType | undefined> = createContext<
  AuthContextType | undefined
>(undefined);

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
