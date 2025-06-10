import { CatalogSection } from "../components/Catalog";
import { CategoryListContext, IsLoadingContext, ProductListContext } from "../contexts/otherContexts";
import { useState, useEffect } from "react";
import { getProductList } from "../api/requests/products";
import type { Product } from "../classes/product";
import { ProductCategory } from "../classes/productCategory";
import { getCategoryList } from "../api/requests/categories";

export function CatalogPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        setProductList(await getProductList());
      } catch (error) {
        console.error(error);
      }
    }

    async function getCategories(): Promise<void> {
      try {
        setCategoryList(await getCategoryList());
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getProducts();
    getCategories();
  }, []);

  return (
    <ProductListContext.Provider value={productList}>
      <CategoryListContext.Provider value={categoryList}>
        <IsLoadingContext.Provider value={isLoading}>
          <CatalogSection></CatalogSection>
        </IsLoadingContext.Provider>
      </CategoryListContext.Provider>
    </ProductListContext.Provider>
  )
}