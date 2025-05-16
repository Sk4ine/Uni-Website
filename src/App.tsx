import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import { Product } from "./classes/product";
import { Review } from "./classes/review";
import { User } from "./classes/user";
import { ProductPage } from "./pages/ProductPage";

import earringsMetalImage from "./assets/productImages/earringsMetal.png";
import defaultUserLogo from './assets/defaultUserLogo.png';
import { CartProvider } from "./components/cartProvider";
import { ProductListContext } from "./components/contexts";

export function App() {
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
  
  return (
    <BrowserRouter>
      <CartProvider>
        <ProductListContext.Provider value={productList}>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="home" element={<HomePage />}></Route>
            <Route path="catalog" element={<CatalogPage />}></Route>
            <Route path="cart" element={<CartPage />}></Route>
            <Route path="catalog">
              {productPageList}
            </Route>
          </Routes>
        </ProductListContext.Provider>
      </CartProvider>
    </BrowserRouter>
  )
}