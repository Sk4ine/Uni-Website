export class Order {
  private _productID: number;

  public get productID(): number {
    return this._productID;
  }

  private _productQuantity: number;

  public get productQuantity(): number {
    return this._productQuantity;
  }

  private _cost: number;

  public get cost(): number {
    return this._cost;
  }

  private _status: string;

  public get status(): string {
    return this._status;
  }

  private _userID: number;

  public get userID(): number {
    return this._userID;
  }

  public constructor(productID: number, productQuantity: number, cost: number, status: string, userID: number) {
    this._productQuantity = productQuantity;
    this._productID = productID;
    this._cost = cost;
    this._status = status;
    this._userID = userID;
  }
}