import { useEffect, useState } from "react";
import { CartProduct } from "../classes/cartProduct";
import { CartContext } from "../contexts/cartContext";

export function CartProvider({ children }: {children: React.ReactNode}) {  
  const [cartProductList, setCartProductList] = useState<CartProduct[]>(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (e) {
      console.error("Ошибка при чтении корзины из localStorage", e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartProductList));
  }, [cartProductList]);
  
  function addProduct(productID: number) {
    if(checkProductPresence(productID)) {
      changeProductQuantity(productID, true);
      return;
    }
    
    setCartProductList(p => [...p, new CartProduct(productID, 1)]);
  }

  function removeProduct(productID: number) {
    setCartProductList(p => p.filter((product) => product.productID != productID));
  }

  function decreaseProductQuantity(productID: number) {
    changeProductQuantity(productID, false);
  }

  function checkProductPresence(productID: number): boolean {
    if(cartProductList.findIndex((product) => product.productID == productID) !== -1) {
      return true;
    }

    return false;
  }

  function changeProductQuantity(productID: number, increase: boolean): void {
    const value: number = increase ? 1 : -1;
    
    setCartProductList(p => {
      const newProductList = [...p];
      newProductList[newProductList.findIndex((product) => product.productID == productID)].quantity += value;
      return newProductList;
    })
    
  }

  return (
    <CartContext.Provider value={{cartProductList, addProduct, removeProduct, decreaseProductQuantity}}>
      {children}
    </CartContext.Provider>
  );
}