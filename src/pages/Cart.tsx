import { Product } from "../classes/product";
import { CartProduct, CartSection } from "../components/componentsCart";
import { Footer, NavigationBar } from "../components/componentsCommon";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";
import type { Cart } from "../classes/cart";
import { useContext } from "react";
import { CartContext } from "../App";

export function CartPage({productList} : {productList: Product[]}) {
  const product1: Product = new Product(1, "Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage]);
  
  let cartProductList: React.ReactNode[] = [];

  const cart = useContext(CartContext);

  for(let i = 0; i < cart.productList.length; i++) {
    const curProd: Product = productList[cart.productList[i].productID];
    cartProductList.push(<CartProduct product={curProd} quantity={cart.productList[i].quantity}></CartProduct>);
  }

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <CartSection>
          {cartProductList}
        </CartSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}