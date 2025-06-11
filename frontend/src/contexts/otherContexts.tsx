import { createContext } from "react";
import type { Product } from "../classes/product";
import { ProductCategory } from "../classes/productCategory";
import type { Order } from "../classes/order";

export const ProductListContext: React.Context<Product[]> = createContext<Product[]>([]);

export const CategoryListContext: React.Context<ProductCategory[]> = createContext<
  ProductCategory[]
>([]);

export const OrderListContext: React.Context<Order[]> = createContext<Order[]>([]);

export const IsLoadingContext: React.Context<boolean> = createContext<boolean>(true);

export const ErrorMessageContext: React.Context<string> = createContext<string>("");
