import { useEffect, useState } from "react";
import { CartSection } from "../components/Cart";
import { ContentWrapper, ErrorMessage, Footer, LoadingMessage, PageWrapper } from "../components/Common";
import type { Product } from "../classes/product";
import { getProductByID, getProductList } from "../api/requests/products";
import { ProductListContext } from "../contexts/otherContexts";
import { NavigationBar } from "../components/NavigationBar";
import { useCartContext } from "../contexts/cartContext";
import type { AxiosError } from "axios";
import axios from "axios";

export function CartPage() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {cartProductList, removeProduct} = useCartContext();

  useEffect(() => {
    async function getProduct(id: number): Promise<Product> {
      try {
        const product: Product = await getProductByID(id);
        return product;
      } catch (err) {
        throw err as AxiosError
      }
    }

    async function getProducts(): Promise<void> {
      for (let i = 0; i < cartProductList.length; i++) {
        try {
          console.log(cartProductList[i].productID)
          productList.push(await getProduct(cartProductList[i].productID));
        } catch (error) {
          if (axios.isAxiosError(error)) {
            switch (error.response?.status) {
              case 404:
                removeProduct(cartProductList[i].productID);
                console.log(`Товар ID: ${cartProductList[i].productID} не найден и удален из корзины: ${error}`);
                break;
              default:
                setErrorMessage("Не удалось загрузить товары:" + error);
                console.log(error);
                return;
            }
          }
        }
      }

      setIsLoading(false);
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