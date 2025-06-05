import { useEffect, useState } from "react";
import { ContentWrapper, Footer, LoadingText, PageWrapper } from "../components/Common";
import { UserProfileSection } from "../components/UserProfile";
import { OrderListContext, ProductListContext } from "../contexts/otherContexts";
import { Navigate } from "react-router";
import { Order } from "../classes/order";
import axios from "axios";
import type { OrderResponse } from "../api/responses/apiResponses";
import type { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";
import { useCurrentUserContext } from "../contexts/currentUserContext";
import { NavigationBar } from "../components/NavigationBar";

export function UserProfilePage() {
  const currentUserContext = useCurrentUserContext();

  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderList, setOrderList] = useState<Order[]>([]);

  useEffect(() => {
    axios.get<OrderResponse[]>(`http://localhost:8080/api/users/${currentUserContext.currentUser?.id}/orders`)
      .then(res => {
        let orders: Order[] = [];

        for(let i = 0; i < res.data.length; i++) {
          const currentOrder: OrderResponse = res.data[i];

          orders.push(new Order(currentOrder.productID, currentOrder.productQuantity, currentOrder.cost, "Обрабатывается", currentOrder.clientID));
        }

        setOrderList(orders);
      })

    async function getProducts(): Promise<void> {
          try {
            const newProductList: Product[] = await getProductList();
            setProductList(newProductList);
          } catch (err) {
            console.error(err);
          } finally {
            setIsLoading(false);
          }
        }
    
    getProducts();
  }, []);

  if(!currentUserContext.currentUser) {
    return <Navigate to="/home"></Navigate>
  }

  return (
    <ProductListContext.Provider value={productList}>
      <OrderListContext.Provider value={orderList}>
        <PageWrapper>
          <NavigationBar></NavigationBar>

          <ContentWrapper>
            {isLoading ? (
              <LoadingText></LoadingText>
            ) : (
              <UserProfileSection></UserProfileSection>
            )}
          </ContentWrapper>
          
          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </PageWrapper>
      </OrderListContext.Provider>
    </ProductListContext.Provider>
  )
}