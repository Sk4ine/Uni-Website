import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { UserProfile } from './pages/UserProfile'
import { Product } from './classes/product'

import earringsMetalImage from "./assets/productImages/earringsMetal.png";
import ratingStarLargeImage from "./assets/ratingStarIconLarge.png";
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router'
import { ProductPage } from './pages/ProductPage'

const productList: Product[] = [];

productList.push(new Product(1, "Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage, ratingStarLargeImage, earringsMetalImage], ["металл", "пластик"], 2, "Россия"));

const productPageList: React.ReactNode[] = [];

for(let i = 0; i < productList.length; i++) {
  productPageList.push(<Route path={productList[i].id.toString()} element={<ProductPage product={productList[i]}/>}></Route>);
}

console.log(productPageList[0]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="home" element={<Home />}></Route>
        <Route path="catalog" element={<Catalog />}></Route>
        <Route path="cart" element={<Cart />}></Route>
        <Route path="catalog">
          {productPageList}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
