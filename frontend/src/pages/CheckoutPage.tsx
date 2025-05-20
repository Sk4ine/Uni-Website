import { CheckoutSection } from "../components/componentsCheckout";
import { Footer, NavigationBar } from "../components/componentsCommon";

import { Navigate } from "react-router";
import { useCheckoutProductContext } from "../components/contexts";

export function CheckoutPage() {
  const checkoutProductContext = useCheckoutProductContext();

  if(!checkoutProductContext.checkoutProduct) {
    return <Navigate to="/home"></Navigate>
  }

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <CheckoutSection></CheckoutSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}