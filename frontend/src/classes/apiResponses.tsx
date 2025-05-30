export interface UserResponse {
  id: number,
  name: string,
  email: string,
  phoneNumber: string
}

export interface ProductResponse {
  id: number,
  categoryID: number,
  name: string,
  price: number,
  materials: string,
  weightInGrams: number,
  quantityInStock: number,
  countryOfOrigin: string
}

export interface CategoryResponse {
  id: number,
  name: string
}

export interface OrderResponse {
  id: number,
  clientID: number,
  dateMade: string,
  shippingAddress: string,
  cost: number
}