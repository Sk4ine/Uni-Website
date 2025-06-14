import { AxiosError } from "axios";
import { Product } from "../../classes/product";
import { ProductCategory } from "../../classes/productCategory";
import { getCategoryList } from "./categories";
import { getProductList } from "./products";
import axiosInstanceAuth from "./axiosInstance";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTableRecords(tableName: string): Promise<ProductCategory[] | Product[]> {
  switch (tableName) {
    case "categories":
      return await getCategoryList();
    case "products":
      return await getProductList();
    default:
      throw new Error("Invalid table name");
  }
}

export async function updateCategory(id: number, name: string): Promise<void> {
  try {
    await axiosInstanceAuth.put<void>(`${API_BASE_URL}/api/admin/categories/${id}`, name);
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function addCategory(): Promise<void> {
  try {
    await axiosInstanceAuth.post<void>(`${API_BASE_URL}/api/admin/categories`);
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function deleteCategory(id: number): Promise<void> {
  try {
    await axiosInstanceAuth.delete<void>(`${API_BASE_URL}/api/admin/categories/${id}`);
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function updateProduct(
  id: number,
  updatedProduct: Product,
  updatedImage: FormData,
): Promise<void> {
  try {
    await axiosInstanceAuth.put<void>(`${API_BASE_URL}/api/admin/products/${id}`, {
      categoryID: updatedProduct.categoryID,
      name: updatedProduct.name,
      price: updatedProduct.price,
      materials: updatedProduct.materials.join(","),
      weightInGrams: updatedProduct.weightGrams,
      quantityInStock: updatedProduct.quantityInStock,
      countryOfOrigin: updatedProduct.countryOfOrigin,
    });

    if ((updatedImage.get("imageFile") as File).size === 0) {
      return;
    }

    await axiosInstanceAuth.post<void>(
      `${API_BASE_URL}/static/admin/productImages/${id}`,
      updatedImage,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function addProduct(): Promise<void> {
  try {
    await axiosInstanceAuth.post<void>(`${API_BASE_URL}/api/admin/products`);
  } catch (error) {
    throw error as AxiosError;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    await axiosInstanceAuth.delete<void>(`${API_BASE_URL}/api/admin/products/${id}`);

    await axiosInstanceAuth.delete<void>(`${API_BASE_URL}/static/admin/productImages/${id}`);
  } catch (error) {
    throw error as AxiosError;
  }
}
