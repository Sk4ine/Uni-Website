import axios, { AxiosError, type AxiosResponse } from "axios";
import { Product } from "../../classes/product";
import { ProductCategory } from "../../classes/productCategory";
import { getCategoryList } from "./categories";
import { getProductList } from "./products";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getTableRecords(tableName: string): Promise<ProductCategory[] | Product[]> {
  try {
    switch (tableName) {
      case "categories":
        return await getCategoryList();
      case "products":
        return await getProductList();
      default:
        throw new Error("Invalid table name");
    }
  } catch (error)  {
    throw error;
  }
}

export async function updateCategory(jwtToken: string | null, id: number, name: string): Promise<void> {
  try {
    await axios.put<void>(`${API_BASE_URL}/api/admin/categories/${id}`, name,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
  } catch (error)  {
    throw error as AxiosError;
  }
}

export async function addCategory(jwtToken: string | null): Promise<void> {
  try {
    await axios.post<void>(`${API_BASE_URL}/api/admin/categories`, {},
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
  } catch (error)  {
    throw error as AxiosError;
  }
}

export async function deleteCategory(jwtToken: string | null, id: number): Promise<void> {
  try {
    await axios.delete<void>(`${API_BASE_URL}/api/admin/categories/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });
  } catch (error)  {
    throw error as AxiosError;
  }
}

export async function updateProduct(jwtToken: string | null, id: number, updatedProduct: Product, updatedImage: FormData): Promise<void> {
  try {
    await axios.put<void>(`${API_BASE_URL}/api/admin/products/${id}`, 
      {
        categoryID: updatedProduct.categoryID,
        name: updatedProduct.name,
        price: updatedProduct.price,
        materials: updatedProduct.materials.join(","),
        weightInGrams: updatedProduct.weightGrams,
        quantityInStock: updatedProduct.quantityInStock,
        countryOfOrigin: updatedProduct.countryOfOrigin
      },
      {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      });

    if(!updatedImage) {
      return;
    }

    await axios.post<void>(`${API_BASE_URL}/static/productImages/${id}`,
      updatedImage,
      { 
        headers: 
        {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${jwtToken}`
        } 
      });
  } catch (error)  {
    throw error as AxiosError;
  }
}

export async function addProduct(jwtToken: string | null): Promise<void> {
  try {
    await axios.post<void>(`${API_BASE_URL}/api/admin/products`, {},
    {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });
  } catch (error)  {
    throw error as AxiosError;
  }
}

export async function deleteProduct(jwtToken: string | null, id: number): Promise<void> {
  try {
    await axios.delete<void>(`${API_BASE_URL}/api/admin/products/${id}`,
    {
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    });

    await axios.delete<void>(`${API_BASE_URL}/static/productImages/${id}`,
      { 
        headers: 
        {
          'Authorization': `Bearer ${jwtToken}`
        } 
      });
  } catch (error)  {
    throw error as AxiosError;
  }
}