import { Product } from "../classes/product";
import { Footer, NavigationBar, ProductCard } from "../components/componentsCommon";
import { ProductList } from "../components/componentsCommon";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";
import { CatalogSection, CategoryButton, CategoryList } from "../components/componentsCatalog";
import { ActiveCategoryContext } from "../components/contexts";
import { useState } from "react";

export function CatalogPage() {
  

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
          <CatalogSection>
            <CategoryList></CategoryList>
            <ProductList></ProductList>
          </CatalogSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}