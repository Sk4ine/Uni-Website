import { createContext, useContext } from "react";
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

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export const ProductListContext: React.Context<Product[]> = createContext<Product[]>([]);

export const CategoryListContext: React.Context<ProductCategory[]> = createContext<ProductCategory[]>([]);

type ActiveCategoryContextType = {
  activeCategory: number;
  setActiveCategory: React.Dispatch<React.SetStateAction<number>>;
}

export const ActiveCategoryContext: React.Context<ActiveCategoryContextType | undefined> = createContext<ActiveCategoryContextType | undefined>(undefined);

export const useActiveCategoryContext = (): ActiveCategoryContextType => {
  const context = useContext(ActiveCategoryContext);
  if (context === undefined) {
    throw new Error('useActiveCategoryContext must be used within a CartProvider');
  }
  return context;
};

type CurrentUserContextType = {
  currentUser: User | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

export const CurrentUserContext: React.Context<CurrentUserContextType | undefined> = createContext<CurrentUserContextType | undefined>(undefined);

export const useCurrentUserContext = (): CurrentUserContextType => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUserContext must be used within a CartProvider');
  }
  return context;
};

type UserListContextType = {
  userList: User[];
  setUserList: React.Dispatch<React.SetStateAction<User[]>>;
}

export const UserListContext: React.Context<UserListContextType | undefined> = createContext<UserListContextType | undefined>(undefined);

export const useUserListContext = (): UserListContextType => {
  const context = useContext(UserListContext);
  if (context === undefined) {
    throw new Error('useUserListContext must be used within a CartProvider');
  }
  return context;
};

export const OrderListContext: React.Context<Order[]> = createContext<Order[]>([]);

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