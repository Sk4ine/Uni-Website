export class CartProduct {
  private _productID: number;

  public get productID(): number {
    return this._productID;
  }

  public quantity: number;

  public constructor(productID: number, quantity: number) {
    this._productID = productID;
    this.quantity = quantity;
  }
}