import type { Review } from "./review";

export class Product {
  private _id: number;

  public get id(): number {
    return this._id;
  }

  private _categoryID: number;

  public get categoryID(): number {
    return this._categoryID;
  }

  private _name: string;

  public get name(): string {
    return this._name;
  }

  private _price: number;

  public get price(): number {
    return this._price;
  }

  public imagePaths: string[] = [];

  private _materials: string[];

  public get materials(): string[] {
    return this._materials;
  }

  private _weightGrams: number;

  public get weightGrams(): number {
    return this._weightGrams;
  }

  private _quantityInStock: number;

  public get quantityInStock(): number {
    return this._quantityInStock;
  }

  private _countryOfOrigin: string;

  public get countryOfOrigin(): string {
    return this._countryOfOrigin;
  }

  private _customerReviews: Review[] = [];

  public get customerReviews(): Review[] {
    return this._customerReviews;
  }

  private _rating: number = 0;

  public get rating(): number {
    return this._rating;
  }

  public constructor(
    id: number,
    categoryID: number,
    name: string,
    price: number,
    materials: string[],
    weightGrams: number,
    quantityInStock: number,
    countryOfOrigin: string,
    imagePaths?: string[],
  ) {
    this._id = id;
    this._categoryID = categoryID;
    this._name = name;
    this._price = price;
    this._materials = materials;
    this._weightGrams = weightGrams;
    this._quantityInStock = quantityInStock;
    this._countryOfOrigin = countryOfOrigin;

    if (imagePaths !== undefined) {
      this.imagePaths = imagePaths;
    }
  }

  public addReview(review: Review): void {
    this._customerReviews.push(review);
    this._rating = this.calculateRating();
  }

  private calculateRating(): number {
    let rating: number = 0;

    for (let i = 0; i < this.customerReviews.length; i++) {
      rating += this.customerReviews[i].rating;
    }

    rating /= this.customerReviews.length;

    return rating;
  }
}
