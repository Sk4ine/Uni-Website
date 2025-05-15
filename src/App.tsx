import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CartPage } from "./pages/Cart";
import { CatalogPage } from "./pages/Catalog";
import { HomePage } from "./pages/Home";
import { createContext, useState } from "react";
import { Cart } from "./classes/cart";
import { Product } from "./classes/product";
import { Review } from "./classes/review";
import { User } from "./classes/user";
import { ProductPage } from "./pages/ProductPage";

import earringsMetalImage from "./assets/productImages/earringsMetal.png";
import defaultUserLogo from './assets/defaultUserLogo.png';

export const CartContext = createContext<Cart | undefined>(undefined);

export function App() {
  const [cart] = useState<Cart>(new Cart());
  const productList: Product[] = [];

  productList.push(new Product(1, "Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage, earringsMetalImage, earringsMetalImage], ["металл", "пластик"], 2, "Россия"));

  const review1: Review = new Review(new User("Марина", "Колесникова", undefined, undefined, defaultUserLogo), new Date(Date.now()), 5, "Все понравилось.", earringsMetalImage);
  const review2: Review = new Review(new User("Сергей", "Белоконский", undefined, undefined, defaultUserLogo), new Date(Date.now()), 5, "Прекрасный товар");
  const review3: Review = new Review(new User("Зина", "Скворцова", undefined, undefined, defaultUserLogo), new Date(Date.now()), 1, "Омерзительное качество", earringsMetalImage);

  productList[0].addReview(review1);
  productList[0].addReview(review2);
  productList[0].addReview(review3);

  const productPageList: React.ReactNode[] = [];

  for(let i = 0; i < productList.length; i++) {
    productPageList.push(<Route path={productList[i].id.toString()} element={<ProductPage product={productList[i]}/>}></Route>);
  }

  const ProductListContext: React.Context<Product[]> = createContext(productList);
  

  return (
    <BrowserRouter>
      <CartContext.Provider value={cart}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />}></Route>
          <Route path="catalog" element={<CatalogPage />}></Route>
          <Route path="cart" element={<CartPage productList={productList} />}></Route>
          <Route path="catalog">
            {productPageList}
          </Route>
        </Routes>
      </CartContext.Provider>
    </BrowserRouter>
  )
}