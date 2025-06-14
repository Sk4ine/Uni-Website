import { AxiosError } from "axios";
import axiosInstanceAuth from "./axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function addOrder(
  shippingAddress: string,
  productID: number,
  productQuantity: number,
): Promise<void> {
  try {
    axiosInstanceAuth.post(`${API_BASE_URL}/api/users/me/orders`, {
      shippingAddress: shippingAddress,
      productID: productID,
      productQuantity: productQuantity,
    });
  } catch (error) {
    throw error as AxiosError;
  }
}
