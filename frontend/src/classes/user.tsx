export class User {
  private _firstName: string | undefined;

  public get firstName(): string | undefined {
    return this._firstName;
  }

  private _secondName: string | undefined;

  public get secondName(): string | undefined {
    return this._secondName;
  }

  private _phoneNumber: string = "";

  public get phoneNumber(): string {
    return this._phoneNumber;
  }

  private _email: string = "";

  public get email(): string {
    return this._email;
  }

  public logoImagePath: string = "/assets/defaultUserLogo.png";

  public constructor(
    email: string,
    firstName?: string,
    secondName?: string,
    phoneNumber?: string,
    logoImagePath?: string,
  ) {
    this._email = email;
    this._firstName = firstName;
    this._secondName = secondName;

    if (phoneNumber !== undefined) {
      this._phoneNumber = phoneNumber;
    }

    if (logoImagePath !== undefined) {
      this.logoImagePath = logoImagePath;
    }
  }
}
