export class User {
  public firstName: string;
  public secondName: string;
  public phoneNumber: string = "";
  public email: string = "";
  public logoImagePath: string = "";

  public constructor(firstName: string, secondName: string, phoneNumber?: string, email?: string, logoImagePath?: string) {
    this.firstName = firstName;
    this.secondName = secondName;

    if(phoneNumber !== undefined) {
      this.phoneNumber = phoneNumber;
    }

    if(email !== undefined) {
      this.email = email;
    }

    if(logoImagePath !== undefined) {
      this.logoImagePath = logoImagePath;
    }
  }
}