import { useContext } from "react";
import type { CartProduct } from "./cartProduct";
import type { Product } from "./product";
import { ProductListContext } from "../components/contexts";

export class Order {
  public productID: number;
  public productQuantity: number;
  public cost: number;
  public status: string; 
  public userID: number;

  public constructor(productID: number, productQuantity: number, cost: number, status: string, userID: number) {
    this.productQuantity = productQuantity;
    this.productID = productID;
    this.cost = cost;
    this.status = status;
    this.userID = userID;
  }
}