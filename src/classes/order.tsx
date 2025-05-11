import type { Product } from "./product";

export class Order {
  public product: Product;
  public cost: number;
  public status: string; 

  public constructor(product: Product, cost: number, status: string) {
    this.product = product;
    this.cost = cost;
    this.status = status;
  }
}