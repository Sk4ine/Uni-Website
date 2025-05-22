import type { Review } from "./review";

export class Product {
  public id: number;
  public categoryID: number;
  public name: string;
  public price: number;
  public imagePaths: string[] = [];
  
  public materials: string[] = [];
  public weightGrams: number = 0;
  public quantityInStock: number = 0;
  public countryOfOrigin: string = "";

  private _customerReviews: Review[] = [];

  public get customerReviews(): Review[] {
    return this._customerReviews;
  }

  public rating: number = 0;

  public constructor(id: number, categoryID: number, name: string, price: number, materials: string[], weightGrams: number, quantityInStock: number, countryOfOrigin: string, imagePaths?: string[]) {
    this.id = id;
    this.categoryID = categoryID;
    this.name = name;
    this.price = price;
    this.materials = materials;
    this.weightGrams = weightGrams;
    this.quantityInStock = quantityInStock;
    this.countryOfOrigin = countryOfOrigin;

    if(imagePaths !== undefined) {
      this.imagePaths = imagePaths;
    }
  }

  public addReview(review: Review): void {
    this._customerReviews.push(review);
    this.rating = this.calculateRating();
  }

  private calculateRating(): number {
    let rating: number = 0;

    for(let i = 0; i < this.customerReviews.length; i++) {
      rating += this.customerReviews[i].rating;
    }

    rating /= this.customerReviews.length;

    return rating;
  }
}