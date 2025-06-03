import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import { User } from "./classes/user";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";

import { CartProvider } from "./providers/cartProvider";
import { useEffect, useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { CartProduct } from "./classes/cartProduct";
import { UserProfilePage } from "./pages/UserProfilePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { UserListContext } from "./contexts/userListContext";
import { CurrentUserContext } from "./contexts/currentUserContext";
import { ActiveCategoryContext } from "./contexts/activeCategoryContext";
import { CheckoutProductContext } from "./contexts/checkoutProductContext";

export function App() {
  const [activeCategory, setActiveCategory] = useState<number>(0);

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
                  <Route path="catalog/:id" element={<ProductDetailsPage />}></Route>
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