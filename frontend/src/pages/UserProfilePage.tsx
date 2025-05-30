import { useEffect, useState } from "react";
import { Footer, NavigationBar } from "../components/componentsCommon";
import { OrdersList, UserInfo, UserProfileSection } from "../components/componentsUserProfile";
import { OrderListContext, useCurrentUserContext } from "../components/contexts";
import { Navigate } from "react-router";
import { Order } from "../classes/order";
import axios from "axios";
import type { OrderResponse } from "../classes/apiResponses";

export function UserProfilePage() {
  const currentUserContext = useCurrentUserContext();

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

          orders.push(new Order(currentOrder.cost, "Обрабатывается", currentOrder.clientID));
        }

        setOrderList(orders);
      })
  }, []);

  return (
    <>
      <div>
        <OrderListContext.Provider value={orderList}>
          <NavigationBar></NavigationBar>
          <UserProfileSection>
            <UserInfo></UserInfo>
            <OrdersList></OrdersList>
          </UserProfileSection>
          <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
        </OrderListContext.Provider>
      </div>
    </>
  )
}