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

type OrderListContextType = {
  orderList: Order[];
  setOrderList: React.Dispatch<React.SetStateAction<Order[]>>;
}

export const OrderListContext: React.Context<OrderListContextType | undefined> = createContext<OrderListContextType | undefined>(undefined);

export const useOrderListContext = (): OrderListContextType => {
  const context = useContext(OrderListContext);
  if (context === undefined) {
    throw new Error('useOrderListContext must be used within a CartProvider');
  }
  return context;
};