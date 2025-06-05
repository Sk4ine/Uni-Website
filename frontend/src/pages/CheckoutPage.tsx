import { CheckoutSection } from "../components/Checkout";
import { ContentWrapper, Footer, LoadingText, PageWrapper } from "../components/Common";

import { Navigate } from "react-router";
import { useEffect, useState } from "react";
import { Product } from "../classes/product";
import type { CartProduct } from "../classes/cartProduct";
import { getProductByID } from "../api/requests/products";
import { useCheckoutProductContext } from "../contexts/checkoutProductContext";
import { useCurrentUserContext } from "../contexts/currentUserContext";
import { CheckoutProductDataContext } from "../contexts/checkoutProductDataContext";
import { NavigationBar } from "../components/NavigationBar";

export function CheckoutPage() {
  const checkoutProductContext = useCheckoutProductContext();

  const currentUserContext = useCurrentUserContext();

  if(!currentUserContext.currentUser) {
    return <Navigate to="/login"></Navigate>
  }

  if(!checkoutProductContext.checkoutProduct) {
    return <Navigate to="/cart"></Navigate>
  }

  const checkoutProduct: CartProduct = checkoutProductContext.checkoutProduct;
  
  const [checkoutProductData, setCheckoutProductData] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
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
  }, []);

  return (
    <PageWrapper>
      <CheckoutProductDataContext.Provider value={checkoutProductData}>
        <NavigationBar></NavigationBar>

        <ContentWrapper>
          {isLoading ? (
            <LoadingText></LoadingText>
          ) : (
            <CheckoutSection></CheckoutSection>
          )}
        </ContentWrapper>
        
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </CheckoutProductDataContext.Provider>
    </PageWrapper>
  )
}