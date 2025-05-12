import { Route } from "react-router";
import type { Product } from "../classes/product";
import { ProductPage } from "./ProductPage";

export function ProductRoute({product} : {product: Product}) {
  return (
    <Route path={product.id.toString()} element={<ProductPage product={product}/>}></Route>
  )
}