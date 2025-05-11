import type { Product } from "../classes/product";
import { Review } from "../classes/review";
import { User } from "../classes/user";
import { Footer, NavigationBar } from "../components/componentsCommon";
import { CustomerReviews, ProductPageSection, ReviewCard } from "../components/componentsProductPage";
import userLogoImage from "../assets/defaultUserLogo.png";

export function ProductPage({product} : {product: Product}) {
  const user1: User = new User("Марина", "Колесникова", undefined, undefined, userLogoImage)
  const review1: Review = new Review(user1, new Date(Date.now()), 4, "Все понравилось.", product.imagePaths[0]);
  
  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <ProductPageSection product={product}>
          <CustomerReviews product={product}>
            <ReviewCard review={review1}></ReviewCard>
          </CustomerReviews>
        </ProductPageSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}