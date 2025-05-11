import { Product } from "../classes/product";
import { CheckoutSection } from "../components/componentsCheckout";
import { Footer, NavigationBar } from "../components/componentsCommon";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";

export function Checkout() {
  const product1: Product = new Product("Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage]);

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