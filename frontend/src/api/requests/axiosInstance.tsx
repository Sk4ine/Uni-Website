import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { useAuthStore } from "../../stores/authStore";

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const axiosInstanceAuth: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstanceAuth.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("jwtToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const isRefreshing = false;

axiosInstanceAuth.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;
    if (error.response && error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return;
      }

      try {
        const refreshToken: () => Promise<void> = useAuthStore.getState().refreshToken;
        const accessToken: string | null = localStorage.getItem("jwtToken");

        await refreshToken();

        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return axiosInstanceAuth(originalRequest);
      } catch (error) {
        const signOut: () => Promise<void> = useAuthStore.getState().signOut;

        console.log(error);
        signOut();
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstanceAuth;
