import type { User } from "./user";

export class Review {
  public user: User;
  public date: Date;
  public rating: number;
  public comment: string;
  public attachedImagePath?: string;

  public constructor(
    user: User,
    date: Date,
    rating: number,
    comment: string,
    attachedImagePath?: string,
  ) {
    this.user = user;
    this.date = date;
    this.rating = rating;
    this.comment = comment;

    if (attachedImagePath !== undefined) {
      this.attachedImagePath = attachedImagePath;
    }
  }
}
