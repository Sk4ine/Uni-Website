import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function addOrder(
  jwtToken: string | null,
  shippingAddress: string,
  productID: number,
  productQuantity: number,
): Promise<void> {
  try {
    axios.post(
      `${API_BASE_URL}/api/users/me/orders`,
      {
        shippingAddress: shippingAddress,
        productID: productID,
        productQuantity: productQuantity,
      },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      },
    );
  } catch (error) {
    throw error as AxiosError;
  }
}
