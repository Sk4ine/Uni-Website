import { Product } from "../classes/product";
import { CartProduct, CartSection } from "../components/componentsCart";
import { Footer, NavigationBar } from "../components/componentsCommon";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";
import { useContext } from "react";
import { CartContext } from "../components/contexts";

export function CartPage() {
  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <CartSection></CartSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}