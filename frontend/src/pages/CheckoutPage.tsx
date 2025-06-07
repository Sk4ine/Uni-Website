import { CheckoutSection } from "../components/Checkout";
import { ContentWrapper, Footer, LoadingMessage, PageWrapper } from "../components/Common";

import { Navigate, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Product } from "../classes/product";
import type { CartProduct } from "../classes/cartProduct";
import { getProductByID } from "../api/requests/products";
import { useCheckoutProductContext } from "../contexts/checkoutProductContext";
import { CheckoutProductDataContext } from "../contexts/checkoutProductDataContext";
import { NavigationBar } from "../components/NavigationBar";
import { useAuthContext } from "../contexts/authContext";

export function CheckoutPage() {
  const checkoutProductContext = useCheckoutProductContext();
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const [checkoutProductData, setCheckoutProductData] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if(!authContext.loadingAuth) {
      return;
    }

    if(!authContext.signedIn) {
      navigate("/login");
      return;
    }

    if(!checkoutProductContext.checkoutProduct) {
      navigate("/cart");
      return;
    }

    if(!checkoutProductContext.checkoutProduct) {
      throw new Error('checkoutProduct is undefined');
    }

    const checkoutProduct: CartProduct = checkoutProductContext.checkoutProduct;

    async function getProduct(): Promise<void> {
      try {
        const newProduct: Product = await getProductByID(checkoutProduct.productID);
        setCheckoutProductData(newProduct);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
        
    getProduct();
  }, [authContext.loadingAuth]);

  return (
    <PageWrapper>
      <CheckoutProductDataContext.Provider value={checkoutProductData}>
        <NavigationBar></NavigationBar>

        <ContentWrapper>
          {isLoading || authContext.loadingAuth ? (
            <LoadingMessage text="Загрузка заказа..." heightVH={50}></LoadingMessage>
          ) : (
            <CheckoutSection></CheckoutSection>
          )}
        </ContentWrapper>
        
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </CheckoutProductDataContext.Provider>
    </PageWrapper>
  )
}