import { Footer, NavigationBar, ProductCard } from "../components/componentsCommon";
import { HomePageBanner, PopularProductsSection } from "../components/componentsHome";
import { Product } from "../classes/product";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";
import { useContext, useState } from "react";
import { ActiveCategoryContext, CurrentUserContext, UserListContext } from "../components/contexts";

export function HomePage() {
  const context = useContext(UserListContext);

  const context1 = useContext(CurrentUserContext);

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