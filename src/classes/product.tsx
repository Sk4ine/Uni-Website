import type { Review } from "./review";

export class Product {
  public name: string;
  public price: number;
  public productPageURL: string;
  public imagePaths: string[] = [];
  
  public partNumber: number;
  public materials: string[] = [];
  public weightGrams: number = 0;
  public countryOfOrigin: string = "";

  public customerReviews: Review[] = [];
  public rating: number = 0;

  public constructor(name: string, price: number, productPageURL: string, partNumber: number, imagePaths?: string[], materials?: string[], weightGrams?: number, countryOfOrigin?: string) {
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
}