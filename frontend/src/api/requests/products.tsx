import type { AxiosError, AxiosResponse } from "axios";
import type { ProductResponse } from "../responses/apiResponses";
import { Product } from "../../classes/product";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getProductList(): Promise<Product[]> {
  try {
    const response: AxiosResponse<ProductResponse[]> = await axios.get<ProductResponse[]>(`${API_BASE_URL}/api/products`);
    const productResponses: ProductResponse[] = response.data;

    const productList: Product[] = productResponses.map(product => new Product(
        product.id, 
        product.categoryID, 
        product.name,
        product.price,
        product.materials.split(","),
        product.weightInGrams,
        product.quantityInStock,
        product.countryOfOrigin
    ));

    for(let i = 0; i < productList.length; i++) {
      const imageResponse: AxiosResponse<Blob> = await axios.get<Blob>(`${API_BASE_URL}/static/productImages/${productList[i].id}`, { responseType: 'blob' });

      productList[i].imagePaths = [URL.createObjectURL(imageResponse.data)];
    }

    return productList;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function getProductByID(id: number): Promise<Product> {
  try {
    const response: AxiosResponse<ProductResponse> = await axios.get<ProductResponse>(`${API_BASE_URL}/api/products/${id}`);

    const product: Product = new Product(
      response.data.id, 
      response.data.categoryID, 
      response.data.name,
      response.data.price,
      response.data.materials.split(","),
      response.data.weightInGrams,
      response.data.quantityInStock,
      response.data.countryOfOrigin
    );

    const imageResponse: AxiosResponse<Blob> = await axios.get<Blob>(`${API_BASE_URL}/static/productImages/${id}`, { responseType: 'blob' });

    product.imagePaths = [URL.createObjectURL(imageResponse.data)];

    return product;
  } catch (error) {
    throw error as AxiosError;
  }
}