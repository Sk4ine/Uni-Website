import { create } from "zustand";
import { checkIfUserIsAdmin, handleLogout } from "../api/requests/user";
import { jwtDecode } from "jwt-decode";
import type { AxiosResponse } from "axios";
import type { JWTTokenResponse } from "../api/responses/apiResponses";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthState {
  accessToken: string;
  signedIn: boolean;
  isAdmin: boolean;
  loadingAuth: boolean;
  signIn: (token: string) => void;
  signOut: () => Promise<void>;
  checkIsAdmin: () => Promise<void>;
  refreshToken: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: "",
  signedIn: false,
  isAdmin: false,
  loadingAuth: true,

  signIn: (token: string): void => {
    localStorage.setItem("jwtToken", token);
    set({ accessToken: token });

    try {
      const decodedToken: { isAdmin?: boolean; exp: number } = jwtDecode(token);
      set({ signedIn: true, isAdmin: !!decodedToken.isAdmin });
    } catch (err) {
      console.error("Failed to decode token on sign-in:", err);
      set({ signedIn: false, isAdmin: false });
    }
  },

  signOut: async (): Promise<void> => {
    try {
      await handleLogout();
      localStorage.removeItem("jwtToken");
      set({ accessToken: "", signedIn: false, isAdmin: false, loadingAuth: false });
    } catch (error) {
      console.log("Logout failed: " + error);
    }
  },

  checkIsAdmin: async (): Promise<void> => {
    set({ loadingAuth: true });

    try {
      const adminStatus: boolean = await checkIfUserIsAdmin();
      set({ isAdmin: adminStatus, loadingAuth: false });
    } catch (err) {
      console.error(err);
    }
  },

  refreshToken: async (): Promise<void> => {
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

        set({ signedIn: true, isAdmin: !!decodedToken.isAdmin });
      } else {
        localStorage.setItem("jwtToken", "");
      }
    } catch (error) {
      console.log(error);
      get().signOut();
    } finally {
      set({ loadingAuth: false });
    }
  },

  initializeAuth: () => {
    get().refreshToken();
  },
}));

export const useAccessToken = (): string => useAuthStore((state) => state.accessToken);
export const useIsAdmin = (): boolean => useAuthStore((state) => state.isAdmin);
export const useLoadingAuth = (): boolean => useAuthStore((state) => state.loadingAuth);
export const useSignedIn = (): boolean => useAuthStore((state) => state.signedIn);

export const useRefreshToken = (): (() => Promise<void>) =>
  useAuthStore((state) => state.refreshToken);
export const useSignIn = (): ((token: string) => void) => useAuthStore((state) => state.signIn);
export const useSignOut = (): (() => Promise<void>) => useAuthStore((state) => state.signOut);
export const useCheckIsAdmin = (): (() => Promise<void>) =>
  useAuthStore((state) => state.checkIsAdmin);

useAuthStore.getState().initializeAuth();
