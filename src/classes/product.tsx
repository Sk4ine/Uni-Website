import type { Review } from "./review";

export class Product {
  public id: number;
  public name: string;
  public price: number;
  public productPageURL: string;
  public imagePaths: string[] = [];
  
  public partNumber: number;
  public materials: string[] = [];
  public weightGrams: number = 0;
  public countryOfOrigin: string = "";

  private _customerReviews: Review[] = [];

  public get customerReviews(): Review[] {
    return this._customerReviews;
  }

  public rating: number = 0;

  public constructor(id: number, name: string, price: number, productPageURL: string, partNumber: number, imagePaths?: string[], materials?: string[], weightGrams?: number, countryOfOrigin?: string) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.productPageURL = productPageURL;
    this.partNumber = partNumber;

    if(imagePaths !== undefined) {
      this.imagePaths = imagePaths;
    }

    if(materials !== undefined) {
      this.materials = materials;
    }

    if(weightGrams !== undefined) {
      this.weightGrams = weightGrams;
    }

    if(countryOfOrigin !== undefined) {
      this.countryOfOrigin = countryOfOrigin;
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