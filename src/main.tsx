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
import { BrowserRouter, Link, Route, Router, Routes } from 'react-router'
import { ProductRoute } from './pages/ProductRoute'

const productList: Product[] = [];

productList.push(new Product(1, "Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage, earringsMetalImage, earringsMetalImage], ["металл", "пластик"], 2, "Россия"));

const productPageList: React.ReactNode[] = [];

for(let i = 0; i < productList.length; i++) {
  productPageList.push(<ProductRoute product={productList[i]}/>);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index path="/home" element={<Home />}></Route>
        <Route index path="/catalog" element={<Catalog />}></Route>
        <Route index path="/cart" element={<Cart />}></Route>
        <Route path="/products">
          {productPageList}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
