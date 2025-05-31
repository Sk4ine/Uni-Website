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
import { ActiveCategoryContext, CategoryListContext, CheckoutProductContext, CurrentUserContext, OrderListContext, ProductListContext, UserListContext } from "./components/contexts";
import { ProductCategory } from "./classes/productCategory";
import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { Order } from "./classes/order";
import { CartProduct } from "./classes/cartProduct";
import { UserProfilePage } from "./pages/UserProfilePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import axios from "axios";

export function App() {
  //localStorage.clear();
  
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const review1: Review = new Review(new User(2, "Марина", "Колесникова", "user_42xq9@example.com", "7mKp#9!dL2", defaultUserLogo), new Date(Date.now()), 5, "Все понравилось.", earringsMetalImage);
  const review2: Review = new Review(new User(3, "Сергей", "Белоконский", "user_42xq9@example.com", "7mKp#9!dL2", defaultUserLogo), new Date(Date.now()), 5, "Прекрасный товар");
  const review3: Review = new Review(new User(4, "Зина", "Скворцова", "user_42xq9@example.com", "7mKp#9!dL2", defaultUserLogo), new Date(Date.now()), 1, "Омерзительное качество", earringsMetalImage);

  const userListField: User[] = [];

  userListField.push(new User(1, "kitamin@gmail.com", "T", "Никита", "Аминов"));

  const [userList, setUserList] = useState(userListField);

  const [currentUser, setCurrentUser] = useState<User | undefined>(() => {
    try {
      const savedUser = localStorage.getItem('user');
      const parsedUser = savedUser ? JSON.parse(savedUser) : undefined;
      return parsedUser ? parsedUser : undefined;
    } catch (e) {
      console.error("Ошибка при чтении пользователя из localStorage", e);
      return undefined;
    }
  });
  
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  const [checkoutProduct, setCheckoutProduct] = useState<CartProduct | undefined>(undefined);
  
  return (
    <BrowserRouter>
      <UserListContext.Provider value={{userList, setUserList}}>
        <CurrentUserContext.Provider value={{currentUser, setCurrentUser}}>
          <CartProvider>
            <ActiveCategoryContext.Provider value={{activeCategory, setActiveCategory}}>
              <CheckoutProductContext.Provider value={{checkoutProduct, setCheckoutProduct}}>
                <Routes>
                  <Route path="/" element={<Navigate to="/home" replace />} />
                  <Route path="home" element={<HomePage />}></Route>
                  <Route path="catalog" element={<CatalogPage />}></Route>
                  <Route path="cart" element={<CartPage />}></Route>
                  <Route path="catalog/:id" element={<ProductPage />}></Route>
                  <Route path="login" element={<LoginPage />}></Route>
                  <Route path="registration" element={<RegistrationPage />}></Route>
                  <Route path="user-profile" element={<UserProfilePage />}></Route>
                  <Route path="checkout" element={<CheckoutPage />}></Route>
                </Routes>
              </CheckoutProductContext.Provider>
            </ActiveCategoryContext.Provider>
          </CartProvider>
        </CurrentUserContext.Provider>
      </UserListContext.Provider>
    </BrowserRouter>
  )
}