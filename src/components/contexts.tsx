import { createContext } from "react";
import type { CartProduct } from "../classes/cartProduct";
import type { Product } from "../classes/product";
import { ProductCategory } from "../classes/productCategory";

export type CartContextType = {
  cartProductList: CartProduct[];
  addProduct: (productID: number) => void;
  removeProduct: (productID: number) => void;
  decreaseProductQuantity: (productID: number) => void;
};

export const CartContext: React.Context<CartContextType | undefined> = createContext<CartContextType | undefined>(undefined);

export const ProductListContext: React.Context<Product[]> = createContext<Product[]>([]);

export const CategoryListContext: React.Context<ProductCategory[]> = createContext<ProductCategory[]>([]);

type ActiveCategoryContextType = {
  activeCategory: number;
  setActiveCategory: React.Dispatch<React.SetStateAction<number>>;
}

export const ActiveCategoryContext: React.Context<ActiveCategoryContextType | undefined> = createContext<ActiveCategoryContextType | undefined>(undefined);