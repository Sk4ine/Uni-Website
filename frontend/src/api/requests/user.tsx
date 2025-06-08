import axios, { AxiosError, type AxiosResponse } from "axios";
import type { LoginResponse, OrderResponse, UserResponse } from "../responses/apiResponses";
import { User } from "../../classes/user";
import { Order } from "../../classes/order";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function checkIfUserIsAdmin(jwtToken: string | null): Promise<boolean> {
  try {
    const response: AxiosResponse<boolean> = await axios.get<boolean>(`${API_BASE_URL}/api/users/me/is-admin`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    return response.data;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function handleLogin(email: string, password: string): Promise<string> {
  try {
    const response: AxiosResponse<LoginResponse> = await axios.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, { email: email, password: password }, {
      headers: {
          'Content-Type': 'application/json',
      }});

    return response.data.token;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function handleRegistration(email: string, password: string): Promise<void> {
  try {
    await axios.post<void>(`${API_BASE_URL}/api/users`, { email: email, password: password });
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function getUserInfo(jwtToken: string | null): Promise<User> {
  try {
    const response: AxiosResponse<UserResponse> = await axios.get<UserResponse>(`${API_BASE_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const userInfo: User = new User(
      response.data.email,
      response.data.name.split(" ")[0],
      response.data.name.split(" ")[1],
      response.data.phoneNumber
    );

    return userInfo;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function getUserOrders(jwtToken: string | null): Promise<Order[]>  {
  try {
    const response = await axios.get<OrderResponse[]>(`${API_BASE_URL}/api/users/me/orders`, { 
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    let orders: Order[] = response.data.map(order => new Order(
      order.productID,
      order.productQuantity,
      order.cost,
      "Обрабатывается"
    ));

    return orders;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function updateUserInfo(jwtToken: string | null, firstName: string, secondName: string, email: string, phoneNumber: string): Promise<User> {
  try {
    const response: AxiosResponse<UserResponse> = await axios.put(`${API_BASE_URL}/api/users/me`, {
      firstName: firstName,
      secondName: secondName,
      email: email,
      phoneNumber: phoneNumber
    }, { 
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    const userName: string[] = response.data.name.split(" ");

    const user: User = new User(response.data.email, userName[0], userName[1], response.data.phoneNumber);

    return user;
  } catch (error) {
    throw error as AxiosError;
  }
}