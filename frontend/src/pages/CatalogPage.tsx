import { Footer, LoadingText, NavigationBar } from "../components/componentsCommon";
import { ProductList } from "../components/componentsCommon";

import { CatalogSection } from "../components/componentsCatalog";
import { CategoryListContext, ProductListContext, useActiveCategoryContext } from "../components/contexts";
import { useState, useEffect } from "react";
import { getProductList } from "../classes/apiRequests";
import type { Product } from "../classes/product";
import axios from "axios";
import type { CategoryResponse, ProductResponse } from "../classes/apiResponses";
import { ProductCategory } from "../classes/productCategory";
import { faL } from "@fortawesome/free-solid-svg-icons";

export function CatalogPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        setProductList(await getProductList());
      } catch (err) {
        console.error(err);
      }
    }

    getProducts();

    axios.get<CategoryResponse[]>("http://localhost:8080/api/categories")
      .then(res => {
        let categoryList: ProductCategory[] = [];

        for(let i = 0; i < res.data.length; i++) {
          const currentCategory: CategoryResponse = res.data[i];

          categoryList.push(new ProductCategory(currentCategory.id, currentCategory.name))
        }

        setCategoryList(categoryList);
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <>
      <div>
        <ProductListContext.Provider value={productList}>
          <CategoryListContext.Provider value={categoryList}>
            <NavigationBar></NavigationBar>

            {isLoading ? (
              <LoadingText></LoadingText>
            ) : (
              <CatalogSection></CatalogSection>
            )}

            <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
          </CategoryListContext.Provider>
        </ProductListContext.Provider>
      </div>
    </>
  )
}