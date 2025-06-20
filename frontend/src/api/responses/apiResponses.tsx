export interface UserResponse {
  name: string;
  email: string;
  phoneNumber: string;
}

export interface ProductResponse {
  id: number;
  categoryID: number;
  name: string;
  price: number;
  materials: string;
  weightInGrams: number;
  quantityInStock: number;
  countryOfOrigin: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface OrderResponse {
  id: number;
  productID: number;
  productQuantity: number;
  clientID: number;
  dateMade: string;
  shippingAddress: string;
  cost: number;
}

export interface TableColumnsResponse {
  columns: string[];
}

export interface JWTTokenResponse {
  token: string;
}
