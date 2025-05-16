import { createContext } from "react";
import type { CartProduct } from "../classes/cartProduct";
import type { Product } from "../classes/product";

export type CartContextType = {
  cartProductList: CartProduct[];
  addProduct: (productID: number) => void;
  removeProduct: (productID: number) => void;
  decreaseProductQuantity: (productID: number) => void;
};

export const CartContext: React.Context<CartContextType | undefined> = createContext<CartContextType | undefined>(undefined);

export const ProductListContext: React.Context<Product[]> = createContext<Product[]>([]);