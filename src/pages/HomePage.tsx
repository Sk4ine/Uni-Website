import { Footer, NavigationBar, ProductCard } from "../components/componentsCommon";
import { HomePageBanner, PopularProductsSection } from "../components/componentsHome";
import { Product } from "../classes/product";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";
import { useContext, useState } from "react";
import { ActiveCategoryContext } from "../components/contexts";

export function HomePage() {
  const context = useContext(ActiveCategoryContext);

  console.log(context?.activeCategory);

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