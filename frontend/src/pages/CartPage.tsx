import { useEffect, useState } from "react";
import { CartSection } from "../components/Cart";
import { ContentWrapper, ErrorMessage, Footer, LoadingMessage, PageWrapper } from "../components/Common";
import { NavigationBar } from "../components/NavigationBar";
import { useCartContext } from "../contexts/cartContext";

export function CartPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {cartProductList, updateCatalogProductList} = useCartContext();

  useEffect(() => {
    async function getProducts(): Promise<void> {
      try {
        await updateCatalogProductList();
        setIsLoading(false);
      } catch (error) {
        setErrorMessage("Не удалось загрузить товары:" + error);
        console.log(error);
      }
    }

    getProducts();
  }, [cartProductList]);

  let content: React.ReactNode = <CartSection></CartSection>;

  if(isLoading) {
    content = <LoadingMessage text="Загрузка корзины..." heightVH={50}></LoadingMessage>
  } else if (errorMessage != "") {
    content = <ErrorMessage text={errorMessage} heightVH={50}></ErrorMessage>
  }

  return (
    <PageWrapper>
      <NavigationBar></NavigationBar>
      
      <ContentWrapper>
        {content}
      </ContentWrapper>

      <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
    </PageWrapper>
  )
}