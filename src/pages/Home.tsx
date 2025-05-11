import { Footer, NavigationBar, ProductCard } from "../components/componentsCommon";
import { HomePageBanner, PopularProductsSection } from "../components/componentsHome";
import { Product } from "../classes/product";

import earringsMetalImage from "../assets/productImages/earringsMetal.png";

export function Home() {
  const product1: Product = new Product("Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage]);

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <HomePageBanner></HomePageBanner>
        <PopularProductsSection>
          <ProductCard product={product1}></ProductCard>
          <ProductCard product={product1}></ProductCard>
          <ProductCard product={product1}></ProductCard>
          <ProductCard product={product1}></ProductCard>
          <ProductCard product={product1}></ProductCard>
          <ProductCard product={product1}></ProductCard>
        </PopularProductsSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}