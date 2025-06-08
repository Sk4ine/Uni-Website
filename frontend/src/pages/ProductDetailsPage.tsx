import { useEffect, useState } from "react";
import { Product } from "../classes/product";
import { ContentWrapper, Footer, LoadingMessage, PageWrapper } from "../components/Common";
import { CustomerReviews, ProductPageSection, ReviewCard } from "../components/ProductDetails";
import axios from "axios";
import type { ProductResponse } from "../api/responses/apiResponses";
import { Navigate, useParams } from "react-router";
import { NavigationBar } from "../components/NavigationBar";
import { getProductByID } from "../api/requests/products";

export function ProductDetailsPage() {
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        if(!id) {
          throw new Error("Product ID is undefined");
        }

        setProduct(await getProductByID(parseInt(id)));
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    }

    getProduct();
  }, []);

  if(!product) {
    return <Navigate to="/home" replace></Navigate>
  }

  const reviewCards: React.ReactNode[] = [];

  for(let i = 0; i < product.customerReviews.length; i++) {
    reviewCards.push(<ReviewCard key={i} review={product.customerReviews[i]}></ReviewCard>);
  }
  
  return (
    <PageWrapper>
      <NavigationBar></NavigationBar>

      <ContentWrapper>
        {isLoading ? (
          <LoadingMessage text="Загрузка товара..." heightVH={100}></LoadingMessage>
        ) : (
          <ProductPageSection product={product}>
            <CustomerReviews product={product}>
              {reviewCards}
            </CustomerReviews>
          </ProductPageSection>
        )}
        
      </ContentWrapper>

      <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
    </PageWrapper>
  )
}