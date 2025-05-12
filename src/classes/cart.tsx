import { CartProduct } from "./cartProduct";

export class Cart {
  private _productList: CartProduct[] = [];

  public get productList() {
    return this._productList;
  }

  public addProduct(productID: number): void {
    if(this.checkProductPresence(productID)) {
      this.changeProductQuantity(productID, true);
    }

    this._productList.push(new CartProduct(productID, 1));
  }

  public removeProduct(productID: number): void {
    if(this.checkProductPresence(productID)) {
      this.changeProductQuantity(productID, false);
    }

    this._productList = this._productList.filter((product) => product.productID != productID);
  }

  public checkProductPresence(productID: number): boolean {
    if(this._productList.findIndex((product) => product.productID == productID) !== -1) {
      return true;
    }

    return false;
  }

  private changeProductQuantity(productID: number, increase: boolean): void {
    const value: number = increase ? 1 : -1;
    
    this._productList[this._productList.findIndex((product) => product.productID == productID)].quantity += value;
  }
}