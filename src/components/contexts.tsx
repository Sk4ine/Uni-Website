import { createContext } from "react";
import type { CartProduct } from "../classes/cartProduct";
import type { Product } from "../classes/product";
import { ProductCategory } from "../classes/productCategory";
import type { User } from "../classes/user";
import type { Order } from "../classes/order";

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

type CurrentUserContextType = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const CurrentUserContext: React.Context<CurrentUserContextType | undefined> = createContext<CurrentUserContextType | undefined>(undefined);

type UserListContextType = {
  userList: User[];
  setUserList: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UserListContext: React.Context<UserListContextType | undefined> = createContext<UserListContextType | undefined>(undefined);

type OrderListContextType = {
  orderList: Order[];
  setOrderList: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const OrderListContext: React.Context<OrderListContextType | undefined> = createContext<OrderListContextType | undefined>(undefined);