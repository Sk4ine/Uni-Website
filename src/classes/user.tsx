export class User {
  public id: number;
  public firstName: string | undefined;
  public secondName: string | undefined;
  public phoneNumber: string = "";
  public email: string = "";
  public password: string;
  public logoImagePath: string | undefined;

  public constructor(id: number, email: string, password: string, firstName?: string, secondName?: string, phoneNumber?: string, logoImagePath?: string) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.secondName = secondName;

    if(phoneNumber !== undefined) {
      this.phoneNumber = phoneNumber;
    }

    if(logoImagePath !== undefined) {
      this.logoImagePath = logoImagePath;
    }
  }
}