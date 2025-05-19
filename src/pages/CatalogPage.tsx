import { Footer, NavigationBar } from "../components/componentsCommon";
import { ProductList } from "../components/componentsCommon";

import { CatalogSection, CategoryList } from "../components/componentsCatalog";

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