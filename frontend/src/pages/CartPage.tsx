import { useEffect, useState } from "react";
import { CartSection } from "../components/Cart";
import { Footer, LoadingText } from "../components/Common";
import type { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";
import { ProductListContext } from "../contexts/otherContexts";
import { NavigationBar } from "../components/NavigationBar";

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
        <div className="flex flex-col min-h-[100vh]">
          <NavigationBar></NavigationBar>
          <div className="grow">
            {isLoading ? (
              <LoadingText></LoadingText>
            ) : (
              <CartSection></CartSection>
            )}
          </div>

          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </div>
      </ProductListContext.Provider>
    </>
  )
}