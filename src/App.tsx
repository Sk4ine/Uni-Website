import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import { Product } from "./classes/product";
import { Review } from "./classes/review";
import { User } from "./classes/user";
import { ProductPage } from "./pages/ProductPage";

import earringsMetalImage from "./assets/productImages/earringsMetal.png";
import ringHeartsImage from "./assets/productImages/ringHearts.png";
import defaultUserLogo from './assets/defaultUserLogo.png';
import { CartProvider } from "./components/cartProvider";
import { ActiveCategoryContext, CategoryListContext, ProductListContext } from "./components/contexts";
import { ProductCategory } from "./classes/productCategory";
import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";

export function App() {
  const categoryList:ProductCategory[] = [];

  categoryList.push(new ProductCategory(1, "Всё"));
  categoryList.push(new ProductCategory(2, "Кольца"));
  categoryList.push(new ProductCategory(3, "Серьги"));
  
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const productList: Product[] = [];

  productList.push(new Product(1, 3, "Серьги металл", 399, 1, [earringsMetalImage, earringsMetalImage, earringsMetalImage], ["металл", "пластик"], 2, "Россия"));
  productList.push(new Product(2, 2, "Кольцо сердца", 349, 2, [ringHeartsImage, ringHeartsImage], ["металл"], 4, "Россия"));

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
        <ActiveCategoryContext.Provider value={{activeCategory, setActiveCategory}}>
          <CategoryListContext.Provider value={categoryList}>
            <ProductListContext.Provider value={productList}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="home" element={<HomePage />}></Route>
                <Route path="catalog" element={<CatalogPage />}></Route>
                <Route path="cart" element={<CartPage />}></Route>
                <Route path="catalog">
                  {productPageList}
                </Route>
                <Route path="login" element={<LoginPage />}></Route>
                <Route path="registration" element={<RegistrationPage />}></Route>
              </Routes>
            </ProductListContext.Provider>
          </CategoryListContext.Provider>
        </ActiveCategoryContext.Provider>
      </CartProvider>
    </BrowserRouter>
  )
}