import type { Product } from "../classes/product";
import { Review } from "../classes/review";
import { User } from "../classes/user";
import { Footer, NavigationBar } from "../components/componentsCommon";
import { CustomerReviews, ProductPageSection, ReviewCard } from "../components/componentsProductPage";
import userLogoImage from "../assets/defaultUserLogo.png";

export function ProductPage({product} : {product: Product}) {
  const user1: User = new User("Марина", "Колесникова", undefined, undefined, userLogoImage)

  const reviewCards: React.ReactNode[] = [];

  for(let i = 0; i < product.customerReviews.length; i++) {
    reviewCards.push(<ReviewCard key={i} review={product.customerReviews[i]}></ReviewCard>);
  }
  
  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <ProductPageSection product={product}>
          <CustomerReviews product={product}>
            {reviewCards}
          </CustomerReviews>
        </ProductPageSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}