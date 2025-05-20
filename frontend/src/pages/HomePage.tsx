import { Footer, NavigationBar } from "../components/componentsCommon";
import { HomePageBanner, PopularProductsSection } from "../components/componentsHome";

export function HomePage() {
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