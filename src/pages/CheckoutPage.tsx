import { Product } from "../classes/product";
import { CheckoutSection } from "../components/componentsCheckout";
import { Footer, NavigationBar } from "../components/componentsCommon";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";

export function CheckoutPage() {
  const product1: Product = new Product(1, 3, "Серьги металл", 399, 1, [earringsMetalImage]);

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <CheckoutSection product={product1}></CheckoutSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}