import { useEffect, useState } from "react";
import { Product } from "../classes/product";
import { LoadingMessage } from "../components/Common";
import {
  CustomerReviews,
  ProductPageSection,
  ReviewCard,
} from "../components/ProductDetails";
import { useParams } from "react-router";
import { getProductByID } from "../api/requests/products";

export function ProductDetailsPage() {
  const [product, setProduct] = useState<Product>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        if (!id) {
          throw new Error("Product ID is undefined");
        }

        setProduct(await getProductByID(parseInt(id)));
        setIsLoading(false);
        window.scrollTo(0, 0);
      } catch (err) {
        console.log(err);
      }
    };

    getProduct();
  }, []);

  return (
    <>
      {!product || isLoading ? (
        <LoadingMessage
          text="Загрузка товара..."
          heightVH={100}
        ></LoadingMessage>
      ) : (
        <ProductPageSection product={product}>
          <CustomerReviews product={product}>
            {product.customerReviews.map((review, index) => (
              <ReviewCard key={index} review={review}></ReviewCard>
            ))}
          </CustomerReviews>
        </ProductPageSection>
      )}
    </>
  );
}
