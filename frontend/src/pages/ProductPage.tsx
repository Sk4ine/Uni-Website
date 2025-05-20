import type { Product } from "../classes/product";
import { Footer, NavigationBar } from "../components/componentsCommon";
import { CustomerReviews, ProductPageSection, ReviewCard } from "../components/componentsProductPage";

export function ProductPage({product} : {product: Product}) {
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