import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import type { JWTTokenResponse } from "../responses/apiResponses";

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
        const response: AxiosResponse<JWTTokenResponse> = await refreshAccessToken();

        if (response) {
          localStorage.setItem("jwtToken", response.data.token);

          originalRequest.headers["Authorization"] = `Bearer ${response.data}`;

          return axiosInstanceAuth(originalRequest);
        }
      } catch (error) {
        console.log(error);
        logout();
      }
    }

    return Promise.reject(error);
  },
);

function logout() {
  if (logoutCallback) {
    logoutCallback();
  } else {
    console.warn("No logout callback is set for axiosInstance");
  }
}

let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
};

export const refreshAccessToken = async (): Promise<AxiosResponse<JWTTokenResponse>> => {
  try {
    const response: AxiosResponse<JWTTokenResponse> = await axios.get<JWTTokenResponse>(
      `${API_BASE_URL}/api/auth/refresh-token`,
      {
        withCredentials: true,
      },
    );

    return response;
  } catch (error) {
    throw error as AxiosError;
  }
};

export default axiosInstanceAuth;
