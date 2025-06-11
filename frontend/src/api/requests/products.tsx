import type { AxiosError, AxiosResponse } from "axios";
import type { ProductResponse } from "../responses/apiResponses";
import { Product } from "../../classes/product";
import axios, { isAxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const defaultProductImage = "/defaultProductImage.jpg";

export async function getProductList(): Promise<Product[]> {
  try {
    const response: AxiosResponse<ProductResponse[]> = await axios.get<ProductResponse[]>(
      `${API_BASE_URL}/api/products`,
    );
    const productResponses: ProductResponse[] = response.data;

    const productList: Product[] = productResponses.map(
      (product) =>
        new Product(
          product.id,
          product.categoryID,
          product.name,
          product.price,
          product.materials.split(","),
          product.weightInGrams,
          product.quantityInStock,
          product.countryOfOrigin,
        ),
    );

    for (let i = 0; i < productList.length; i++) {
      let imageResponse: AxiosResponse<Blob> | undefined = undefined;

      try {
        imageResponse = await axios.get<Blob>(
          `${API_BASE_URL}/static/productImages/${productList[i].id}`,
          { responseType: "blob" },
        );
      } catch (error) {
        if (isAxiosError(error)) {
          if (error.status == 404) {
            productList[i].imagePaths = [defaultProductImage];
            continue;
          }
        }
        throw error as AxiosError;
      }

      productList[i].imagePaths = [URL.createObjectURL(imageResponse.data)];
    }

    return productList;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function getProductByID(id: number): Promise<Product> {
  try {
    const response: AxiosResponse<ProductResponse> = await axios.get<ProductResponse>(
      `${API_BASE_URL}/api/products/${id}`,
    );

    const product: Product = new Product(
      response.data.id,
      response.data.categoryID,
      response.data.name,
      response.data.price,
      response.data.materials.split(","),
      response.data.weightInGrams,
      response.data.quantityInStock,
      response.data.countryOfOrigin,
    );

    let imageResponse: AxiosResponse<Blob> | undefined = undefined;

    try {
      imageResponse = await axios.get<Blob>(`${API_BASE_URL}/static/productImages/${product.id}`, {
        responseType: "blob",
      });
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.status == 404) {
          product.imagePaths = [defaultProductImage];
          return product;
        }
      }

      throw error as AxiosError;
    }

    product.imagePaths = [URL.createObjectURL(imageResponse.data)];

    return product;
  } catch (error) {
    throw error as AxiosError;
  }
}
