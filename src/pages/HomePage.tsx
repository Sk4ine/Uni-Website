import { Footer, NavigationBar, ProductCard } from "../components/componentsCommon";
import { HomePageBanner, PopularProductsSection } from "../components/componentsHome";
import { Product } from "../classes/product";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";
import { useContext, useState } from "react";

export function HomePage() {
  const product1: Product = new Product(1, "Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage]);

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <HomePageBanner></HomePageBanner>
        <PopularProductsSection></PopularProductsSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}