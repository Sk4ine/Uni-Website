import axios, { AxiosError, type AxiosResponse } from "axios";
import type { ProductResponse } from "./apiResponses";
import { Product } from "./product";

export async function getProductList(): Promise<Product[]> {
  try {
    const response: AxiosResponse<ProductResponse[]> = await axios.get<ProductResponse[]>("http://localhost:8080/api/products");

    let productList: Product[] = [];

    for(let i = 0; i < response.data.length; i++) {
      const curProduct: ProductResponse = response.data[i];
      productList.push(new Product(
        curProduct.id, 
        curProduct.categoryID, 
        curProduct.name,
        curProduct.price,
        curProduct.materials.split(","),
        curProduct.weightInGrams,
        curProduct.quantityInStock,
        curProduct.countryOfOrigin
      ));
    }

    for(let i = 0; i < productList.length; i++) {
      const imageResponse: AxiosResponse<Blob> = await axios.get<Blob>(`http://localhost:8080/static/productImages/${productList[i].id}`, {
          responseType: 'blob'
        });

      productList[i].imagePaths = [URL.createObjectURL(imageResponse.data)];
    }

    return productList;
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function getProductByID(id: number): Promise<Product> {
  try {
    const response: AxiosResponse<ProductResponse> = await axios.get<ProductResponse>(`http://localhost:8080/api/products/${id}`);

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

    const imageResponse: AxiosResponse<Blob> = await axios.get<Blob>(`http://localhost:8080/static/productImages/${id}`, {
      responseType: 'blob'
    });

    product.imagePaths = [URL.createObjectURL(imageResponse.data)];

    return product;
  } catch (error) {
    throw error as AxiosError;
  }
}