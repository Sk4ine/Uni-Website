export class ProductCategory {
  private _id: number;

  public get id(): number {
    return this._id;
  }

  private _name: string;

  public get name(): string {
    return this._name;
  }

  public constructor(id: number, name: string) {
    this._id = id;
    this._name = name;
  }
}
