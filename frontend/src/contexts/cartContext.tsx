import { createContext, useContext } from "react";
import type { CartProduct } from "../classes/cartProduct";
import type { Product } from "../classes/product";

export type CartContextType = {
  cartProductList: CartProduct[];
  catalogProductList: Product[];
  addProduct: (productID: number) => void;
  removeProduct: (productID: number) => void;
  decreaseProductQuantity: (productID: number) => void;
  updateCatalogProductList: () => Promise<void>;
};

export const CartContext: React.Context<CartContextType | undefined> = createContext<
  CartContextType | undefined
>(undefined);

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider");
  }
  return context;
};
