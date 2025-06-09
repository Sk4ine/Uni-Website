import { useEffect, useState } from "react";
import { ContentWrapper, Footer, LoadingMessage, PageWrapper } from "../components/Common";
import { HomePageBanner, PopularProductsSection } from "../components/Home";
import { ProductListContext } from "../contexts/otherContexts";
import { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";
import { NavigationBar } from "../components/NavigationBar";

export function HomePage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        setProductList(await getProductList());
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    getProducts();
  }, []);
  

  return (
    <PageWrapper>
      <ProductListContext.Provider value={productList}>
        <NavigationBar></NavigationBar>
        
        <ContentWrapper>
          <HomePageBanner></HomePageBanner>

          {isLoading ? (
            <LoadingMessage text="Загрузка товаров..." heightVH={50}></LoadingMessage>
          ) : (
            <PopularProductsSection></PopularProductsSection>
          )}
        </ContentWrapper>

        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </ProductListContext.Provider>
    </PageWrapper>
  )
}