import { useEffect, useState } from "react";
import { LoadingMessage } from "../components/Common";
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
        setIsLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    getProducts();
  }, []);
  

  return (
    <ProductListContext.Provider value={productList}>
      <HomePageBanner></HomePageBanner>

      {isLoading ? (
        <LoadingMessage text="Загрузка товаров..." heightVH={50}></LoadingMessage>
      ) : (
        <PopularProductsSection></PopularProductsSection>
      )}
    </ProductListContext.Provider>
  )
}