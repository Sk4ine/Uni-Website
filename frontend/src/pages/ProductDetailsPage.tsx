import { useEffect, useState } from "react";
import { Product } from "../classes/product";
import { ContentWrapper, Footer, PageWrapper } from "../components/Common";
import { CustomerReviews, ProductPageSection, ReviewCard } from "../components/ProductDetails";
import axios from "axios";
import type { ProductResponse } from "../api/responses/apiResponses";
import { useParams } from "react-router";
import { NavigationBar } from "../components/NavigationBar";

export function ProductDetailsPage() {
  const [product, setProduct] = useState<Product>();

  const { id } = useParams();

  useEffect(() => {
    let newProduct: Product;

    const getProduct = async () => {
      try {
        const productResponse = await axios.get<ProductResponse>(`http://localhost:8080/api/products/${id}`);
        newProduct = new Product(
            productResponse.data.id,
            productResponse.data.categoryID,
            productResponse.data.name,
            productResponse.data.price,
            productResponse.data.materials.split(","),
            productResponse.data.weightInGrams,
            productResponse.data.quantityInStock,
            productResponse.data.countryOfOrigin
        );
        const imageResponse = await axios.get<Blob>(`http://localhost:8080/static/productImages/${id}`, {responseType: 'blob'});
        newProduct.imagePaths = [URL.createObjectURL(imageResponse.data)];
        setProduct(newProduct);
      } catch (err) {
        console.log(err);
      }
    }

    getProduct();
  }, []);

  if(!product) {
    return;
  }

  const reviewCards: React.ReactNode[] = [];

  for(let i = 0; i < product.customerReviews.length; i++) {
    reviewCards.push(<ReviewCard key={i} review={product.customerReviews[i]}></ReviewCard>);
  }
  
  return (
    <PageWrapper>
      <NavigationBar></NavigationBar>

      <ContentWrapper>
        <ProductPageSection product={product}>
          <CustomerReviews product={product}>
            {reviewCards}
          </CustomerReviews>
        </ProductPageSection>
      </ContentWrapper>

      <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
    </PageWrapper>
  )
}