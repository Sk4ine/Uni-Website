import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CartPage } from "./pages/CartPage/CartPage";
import { CatalogPage } from "./pages/CatalogPage/CatalogPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";

import { useState } from "react";
import { LoginPage } from "./pages/LoginPage/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { CartProduct } from "./classes/cartProduct";
import { UserProfilePage } from "./pages/UserProfilePage/UserProfilePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ActiveCategoryContext } from "./contexts/activeCategoryContext";
import { CheckoutProductContext } from "./contexts/checkoutProductContext";
import { AdminPanelPage } from "./pages/AdminPanelPage";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout/AuthLayout";
import { useInitializeCart } from "./stores/cartStore";

export function App() {
  const [activeCategory, setActiveCategory] = useState<number>(1);

  const [checkoutProduct, setCheckoutProduct] = useState<CartProduct | undefined>(undefined);

  const initializeCart = useInitializeCart();

  initializeCart();

  return (
    <BrowserRouter>
      <ActiveCategoryContext.Provider value={{ activeCategory, setActiveCategory }}>
        <CheckoutProductContext.Provider value={{ checkoutProduct, setCheckoutProduct }}>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/home" />}></Route>
              <Route path="home" element={<HomePage />}></Route>
              <Route path="catalog" element={<CatalogPage />}></Route>
              <Route path="cart" element={<CartPage />}></Route>
              <Route path="catalog/:id" element={<ProductDetailsPage />}></Route>
              <Route path="user-profile" element={<UserProfilePage />}></Route>
              <Route path="checkout" element={<CheckoutPage />}></Route>
            </Route>

            <Route path="auth" element={<AuthLayout />}>
              <Route path="login" element={<LoginPage />}></Route>
              <Route path="registration" element={<RegistrationPage />}></Route>
            </Route>

            <Route path="admin-panel" element={<AdminPanelPage />}></Route>
          </Routes>
        </CheckoutProductContext.Provider>
      </ActiveCategoryContext.Provider>
    </BrowserRouter>
  );
}
