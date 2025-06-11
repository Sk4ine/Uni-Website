import axios, { AxiosError, type AxiosResponse } from "axios";
import { ProductCategory } from "../../classes/productCategory";
import type { CategoryResponse } from "../responses/apiResponses";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getCategoryList(): Promise<ProductCategory[]> {
  try {
    const response: AxiosResponse<CategoryResponse[]> = await axios.get<
      CategoryResponse[]
    >(`${API_BASE_URL}/api/categories`);

    const categoryList: ProductCategory[] = response.data.map(
      (category) => new ProductCategory(category.id, category.name),
    );

    return categoryList;
  } catch (error) {
    throw error as AxiosError;
  }
}
