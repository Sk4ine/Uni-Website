import { useContext } from "react";
import type { CartProduct } from "./cartProduct";
import type { Product } from "./product";
import { ProductListContext } from "../components/contexts";

export class Order {
  public product: CartProduct;
  public cost: number;
  public status: string; 
  public userID: number;

  public constructor(product: CartProduct, cost: number, status: string, userID: number) {
    this.product = product;
    this.cost = cost;
    this.status = status;
    this.userID = userID;
  }
}