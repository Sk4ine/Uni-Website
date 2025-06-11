import { useEffect, useState } from "react";
import { HomePageBanner, PopularProductsSection } from "../components/Home";
import { IsLoadingContext, ProductListContext } from "../contexts/otherContexts";
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
      <IsLoadingContext.Provider value={isLoading}>
        <HomePageBanner />
        <PopularProductsSection />
      </IsLoadingContext.Provider>
    </ProductListContext.Provider>
  );
}
