import { useEffect, useState } from "react";
import { Footer, LoadingText, NavigationBar } from "../components/Common";
import { UserProfileSection } from "../components/UserProfile";
import { OrderListContext, ProductListContext } from "../contexts/otherContexts";
import { Navigate } from "react-router";
import { Order } from "../classes/order";
import axios from "axios";
import type { OrderResponse } from "../api/responses/apiResponses";
import type { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";
import { useCurrentUserContext } from "../contexts/currentUserContext";

export function UserProfilePage() {
  const currentUserContext = useCurrentUserContext();

  const [productList, setProductList] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  if(!currentUserContext.currentUser) {
    return <Navigate to="/home"></Navigate>
  }

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

  return (
    <>
      <ProductListContext.Provider value={productList}>
        <OrderListContext.Provider value={orderList}>
          <div>
            <NavigationBar></NavigationBar>

            {isLoading ? (
              <LoadingText></LoadingText>
            ) : (
              <UserProfileSection></UserProfileSection>
            )}
            
            <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
          </div>
        </OrderListContext.Provider>
      </ProductListContext.Provider>
    </>
  )
}