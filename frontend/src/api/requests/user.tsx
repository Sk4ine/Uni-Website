import axios, { AxiosError, type AxiosResponse } from "axios";
import type { JWTTokenResponse, OrderResponse, UserResponse } from "../responses/apiResponses";
import { User } from "../../classes/user";
import { Order } from "../../classes/order";
import axiosInstanceAuth from "./axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function checkIfUserIsAdmin(): Promise<boolean> {
  try {
    const response: AxiosResponse<boolean> = await axiosInstanceAuth.get<boolean>(
      `${API_BASE_URL}/api/users/me/is-admin`,
    );

    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function handleLogin(email: string, password: string): Promise<string> {
  try {
    const response: AxiosResponse<JWTTokenResponse> = await axios.post<JWTTokenResponse>(
      `${API_BASE_URL}/api/auth/login`,
      {
        email: email,
        password: password,
      },
      { withCredentials: true },
    );

    return response.data.token;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function handleRegistration(email: string, password: string): Promise<void> {
  try {
    await axios.post<void>(`${API_BASE_URL}/api/auth/register`, {
      email: email,
      password: password,
    });
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function getUserInfo(): Promise<User> {
  try {
    const response: AxiosResponse<UserResponse> = await axiosInstanceAuth.get<UserResponse>(
      `${API_BASE_URL}/api/users/me`,
    );

    const userInfo: User = new User(
      response.data.email,
      response.data.name.split(" ")[0],
      response.data.name.split(" ")[1],
      response.data.phoneNumber,
    );

    return userInfo;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function getUserOrders(): Promise<Order[]> {
  try {
    const response = await axiosInstanceAuth.get<OrderResponse[]>(
      `${API_BASE_URL}/api/users/me/orders`,
    );

    if (!response.data) {
      return [];
    }

    const orders: Order[] = response.data.map(
      (order) => new Order(order.productID, order.productQuantity, order.cost, "Обрабатывается"),
    );

    return orders;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function updateUserInfo(
  firstName: string,
  secondName: string,
  email: string,
  phoneNumber: string,
): Promise<User> {
  try {
    const response: AxiosResponse<UserResponse> = await axiosInstanceAuth.put(
      `${API_BASE_URL}/api/users/me`,
      {
        firstName: firstName,
        secondName: secondName,
        email: email,
        phoneNumber: phoneNumber,
      },
    );

    const userName: string[] = response.data.name.split(" ");

    const user: User = new User(
      response.data.email,
      userName[0],
      userName[1],
      response.data.phoneNumber,
    );

    return user;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function handleLogout(): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/api/auth/logout`, {
      withCredentials: true,
    });
  } catch (error) {
    throw error as AxiosError;
  }
}
