import { useEffect, useState } from "react";
import { CartSection } from "../components/componentsCart";
import { Footer, LoadingText, NavigationBar } from "../components/componentsCommon";
import type { Product } from "../classes/product";
import { getProductList } from "../classes/apiRequests";
import { ProductListContext } from "../components/contexts";

export function CartPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        const newProductList: Product[] = await getProductList();
        setProductList(newProductList);
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

          {isLoading ? (
            <LoadingText></LoadingText>
          ) : (
            <CartSection></CartSection>
          )}

          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </div>
      </ProductListContext.Provider>
    </>
  )
}