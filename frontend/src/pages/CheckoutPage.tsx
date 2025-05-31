import { CheckoutSection } from "../components/componentsCheckout";
import { Footer, LoadingText, NavigationBar } from "../components/componentsCommon";

import { Navigate } from "react-router";
import { CheckoutProductContext, CheckoutProductDataContext, useCheckoutProductContext, useCurrentUserContext } from "../components/contexts";
import { createContext, useEffect, useState } from "react";
import { Product } from "../classes/product";
import axios from "axios";
import type { ProductResponse } from "../classes/apiResponses";
import type { CartProduct } from "../classes/cartProduct";
import { getProductByID } from "../classes/apiRequests";

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
    <>
      <CheckoutProductDataContext.Provider value={checkoutProductData}>
        <div>
          <NavigationBar></NavigationBar>

          {isLoading ? (
            <LoadingText></LoadingText>
          ) : (
            <CheckoutSection></CheckoutSection>
          )}
          
          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </div>
      </CheckoutProductDataContext.Provider>
    </>
  )
}