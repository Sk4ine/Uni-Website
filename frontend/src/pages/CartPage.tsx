import { useEffect, useState } from "react";
import { CartSection } from "../components/Cart";
import { useCartContext } from "../contexts/cartContext";
import { ErrorMessageContext, IsLoadingContext } from "../contexts/otherContexts";

export function CartPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { cartProductList, updateCatalogProductList } = useCartContext();

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
  }, [cartProductList, updateCatalogProductList]);

  return (
    <IsLoadingContext.Provider value={isLoading}>
      <ErrorMessageContext.Provider value={errorMessage}>
        <CartSection></CartSection>
      </ErrorMessageContext.Provider>
    </IsLoadingContext.Provider>
  );
}
