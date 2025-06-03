import { useEffect, useState } from "react";
import { Footer, LoadingText, NavigationBar } from "../components/Common";
import { HomePageBanner, PopularProductsSection } from "../components/Home";
import { ProductListContext } from "../contexts/otherContexts";
import { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";

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