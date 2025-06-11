import { createContext, useContext } from "react";
import type { Product } from "../classes/product";

export const CheckoutProductDataContext: React.Context<Product | undefined> = createContext<
  Product | undefined
>(undefined);

export const useCheckoutProductDataContext = (): Product => {
  const context = useContext(CheckoutProductDataContext);
  if (context === undefined) {
    throw new Error("useCheckoutProductDataContext must be used within a provider");
  }
  return context;
};
