import { useEffect, useState } from "react";
import { Footer, LoadingText, NavigationBar } from "../components/componentsCommon";
import { HomePageBanner, PopularProductsSection } from "../components/componentsHome";
import { ProductListContext } from "../components/contexts";
import axios from "axios";
import type { ProductResponse } from "../classes/apiResponses";
import { Product } from "../classes/product";
import { getProductList } from "../classes/apiRequests";
import { faL } from "@fortawesome/free-solid-svg-icons";

export function HomePage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        setProductList(await getProductList());
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, []);
  

  return (
    <>
      <ProductListContext.Provider value={productList}>
        <div>
          <NavigationBar></NavigationBar>
          <HomePageBanner></HomePageBanner>

          {isLoading ? (
            <LoadingText></LoadingText>
          ) : (
            <PopularProductsSection></PopularProductsSection>
          )}

          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </div>
      </ProductListContext.Provider>
    </>
  )
}