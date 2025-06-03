import { createContext, useContext } from "react";
import type { CartProduct } from "../classes/cartProduct";

export type CartContextType = {
  cartProductList: CartProduct[];
  addProduct: (productID: number) => void;
  removeProduct: (productID: number) => void;
  decreaseProductQuantity: (productID: number) => void;
};

export const CartContext: React.Context<CartContextType | undefined> = createContext<CartContextType | undefined>(undefined);

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};