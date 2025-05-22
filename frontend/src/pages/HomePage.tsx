import { useEffect, useState } from "react";
import { Footer, NavigationBar } from "../components/componentsCommon";
import { HomePageBanner, PopularProductsSection } from "../components/componentsHome";
import { ProductListContext } from "../components/contexts";
import axios from "axios";
import type { ProductResponse } from "../classes/apiResponses";
import { Product } from "../classes/product";
import { getProductList } from "../classes/apiRequests";

export function HomePage() {
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
          <HomePageBanner></HomePageBanner>
          <PopularProductsSection></PopularProductsSection>
          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </ProductListContext.Provider>
      </div>
    </>
  )
}