import { CheckoutSection } from "../components/Checkout";
import { LoadingMessage } from "../components/Common";
import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { Product } from "../classes/product";
import type { CartProduct } from "../classes/cartProduct";
import { getProductByID } from "../api/requests/products";
import { useCheckoutProductContext } from "../contexts/checkoutProductContext";
import { CheckoutProductDataContext } from "../contexts/checkoutProductDataContext";
import { useAuthContext } from "../contexts/authContext";
import { UserInfoProvider } from "../providers/UserInfoProvider";

export function CheckoutPage() {
  const checkoutProductContext = useCheckoutProductContext();
  const authContext = useAuthContext();

  const [checkoutProductData, setCheckoutProductData] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (authContext.loadingAuth || !authContext.signedIn) {
      return;
    }

    if (!checkoutProductContext.checkoutProduct) {
      return;
    }

    const checkoutProduct: CartProduct = checkoutProductContext.checkoutProduct;

    async function getProduct(): Promise<void> {
      try {
        const newProduct: Product = await getProductByID(
          checkoutProduct.productID,
        );
        setCheckoutProductData(newProduct);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    getProduct();
  }, [authContext.loadingAuth]);

  if (authContext.loadingAuth) {
    return (
      <LoadingMessage
        text="Загрузка данных пользователя..."
        heightVH={100}
      ></LoadingMessage>
    );
  }

  if (!authContext.signedIn) {
    return <Navigate to="/auth/login" replace></Navigate>;
  }

  if (!checkoutProductContext.checkoutProduct) {
    return <Navigate to="/cart" replace></Navigate>;
  }

  return (
    <CheckoutProductDataContext.Provider value={checkoutProductData}>
      <UserInfoProvider>
        {isLoading || authContext.loadingAuth ? (
          <LoadingMessage
            text="Загрузка заказа..."
            heightVH={50}
          ></LoadingMessage>
        ) : (
          <CheckoutSection></CheckoutSection>
        )}
      </UserInfoProvider>
    </CheckoutProductDataContext.Provider>
  );
}
