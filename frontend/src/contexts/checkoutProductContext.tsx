import { createContext, useContext } from "react";
import type { CartProduct } from "../classes/cartProduct";

type CheckoutProductContextType = {
  checkoutProduct: CartProduct | undefined;
  setCheckoutProduct: React.Dispatch<React.SetStateAction<CartProduct | undefined>>;
}

export const CheckoutProductContext: React.Context<CheckoutProductContextType | undefined> = createContext<CheckoutProductContextType | undefined>(undefined);

export const useCheckoutProductContext = (): CheckoutProductContextType => {
  const context = useContext(CheckoutProductContext);
  if (context === undefined) {
    throw new Error('useCheckoutProductContext must be used within a CartProvider');
  }
  return context;
};