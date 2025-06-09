import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import { ProductDetailsPage } from "./pages/ProductDetailsPage";

import { CartProvider } from "./providers/cartProvider";
import { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { RegistrationPage } from "./pages/RegistrationPage";
import { CartProduct } from "./classes/cartProduct";
import { UserProfilePage } from "./pages/UserProfilePage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ActiveCategoryContext } from "./contexts/activeCategoryContext";
import { CheckoutProductContext } from "./contexts/checkoutProductContext";
import { AdminPanelPage } from "./pages/AdminPanelPage";
import { AuthProvider } from "./providers/AuthProvider";

export function App() {
  const [activeCategory, setActiveCategory] = useState<number>(1);

  const [checkoutProduct, setCheckoutProduct] = useState<CartProduct | undefined>(undefined);
  
  return (
    <BrowserRouter>
      <AuthProvider>
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
                <Route path="admin-panel" element={<AdminPanelPage />}></Route>
              </Routes>
            </CheckoutProductContext.Provider>
          </ActiveCategoryContext.Provider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}