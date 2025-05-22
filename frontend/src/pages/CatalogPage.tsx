import { Footer, NavigationBar } from "../components/componentsCommon";
import { ProductList } from "../components/componentsCommon";

import { CatalogSection, CategoryList } from "../components/componentsCatalog";
import { ProductListContext, useActiveCategoryContext } from "../components/contexts";
import { useState, useEffect } from "react";
import { getProductList } from "../classes/apiRequests";
import type { Product } from "../classes/product";

export function CatalogPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  
  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        setProductList(await getProductList());
      } catch (err) {
        console.error(err);
      }
    }

    getProducts();
  }, []);

  return (
    <>
      <div>
        <ProductListContext.Provider value={productList}>
          <NavigationBar></NavigationBar>
            <CatalogSection>
              <CategoryList></CategoryList>
              <ProductList></ProductList>
            </CatalogSection>
          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </ProductListContext.Provider>
      </div>
    </>
  )
}