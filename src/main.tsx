import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { UserProfile } from './pages/UserProfile'
import { ProductPage } from './pages/ProductPage'
import { Product } from './classes/product'

import earringsMetalImage from "./assets/productImages/earringsMetal.png";

const product1: Product = new Product("Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage, earringsMetalImage, earringsMetalImage], ["металл", "пластик"], 2, "Россия");

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProductPage product={product1} />
  </StrictMode>,
)
