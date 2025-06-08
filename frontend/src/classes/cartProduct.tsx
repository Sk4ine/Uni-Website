export class CartProduct {
  public productID: number;

  public quantity: number;

  public constructor(productID: number, quantity: number) {
    this.productID = productID;
    this.quantity = quantity;
  }
}