import { Product } from "../classes/product";
import { Footer, NavigationBar, ProductCard } from "../components/componentsCommon";
import { ProductList } from "../components/componentsCommon";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";
import { CatalogSection, CategoryButton, CategoryList } from "../components/componentsCatalog";

export function CatalogPage() {
  const product1: Product = new Product(1, "Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage]);

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <CatalogSection>
          <CategoryList>
            <CategoryButton categoryName="Всё" active={true}></CategoryButton>
            <CategoryButton categoryName="Кольца" active={false}></CategoryButton>
            <CategoryButton categoryName="Кольца" active={false}></CategoryButton>
            <CategoryButton categoryName="Кольца" active={false}></CategoryButton>
            <CategoryButton categoryName="Кольца" active={false}></CategoryButton>
            <CategoryButton categoryName="Кольца" active={false}></CategoryButton>
            <CategoryButton categoryName="Кольца" active={false}></CategoryButton>
          </CategoryList>
          <ProductList>
            <ProductCard product={product1}></ProductCard>
            <ProductCard product={product1}></ProductCard>
            <ProductCard product={product1}></ProductCard>
            <ProductCard product={product1}></ProductCard>
            <ProductCard product={product1}></ProductCard>
            <ProductCard product={product1}></ProductCard>
          </ProductList>
        </CatalogSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}