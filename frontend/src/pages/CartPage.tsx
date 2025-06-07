import { useEffect, useState } from "react";
import { CartSection } from "../components/Cart";
import { ContentWrapper, ErrorMessage, Footer, LoadingMessage, PageWrapper } from "../components/Common";
import type { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";
import { ProductListContext } from "../contexts/otherContexts";
import { NavigationBar } from "../components/NavigationBar";

export function CartPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        const newProductList: Product[] = await getProductList();
        setProductList(newProductList);
      } catch (err) {
        setErrorMessage("Не удалось загрузить товары");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    getProducts();
  }, []);

  let content: React.ReactNode = <CartSection></CartSection>;

  if(isLoading) {
    content = <LoadingMessage text="Загрузка корзины..." heightVH={50}></LoadingMessage>
  } else if (errorMessage != "") {
    content = <ErrorMessage text={errorMessage} heightVH={50}></ErrorMessage>
  }
  return (
    <ProductListContext.Provider value={productList}>
      <PageWrapper>
        <NavigationBar></NavigationBar>
        
        <ContentWrapper>
          {content}
        </ContentWrapper>

        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </PageWrapper>
    </ProductListContext.Provider>
  )
}