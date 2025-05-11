import { Product } from "../classes/product";
import { CartProduct, CartSection } from "../components/componentsCart";
import { Footer, NavigationBar } from "../components/componentsCommon";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";

export function Cart() {
  const product1: Product = new Product("Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage]);
  
  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <CartSection>
          <CartProduct product={product1} quantity={1}></CartProduct>
          <CartProduct product={product1} quantity={1}></CartProduct>
        </CartSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}