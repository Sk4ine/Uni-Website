import { useEffect, useState } from "react";
import { LoadingMessage } from "../components/Common";
import { UserProfileSection } from "../components/UserProfile";
import { OrderListContext, ProductListContext } from "../contexts/otherContexts";
import { Navigate } from "react-router";
import { Order } from "../classes/order";
import type { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";
import { useAuthContext } from "../contexts/authContext";
import { getUserOrders } from "../api/requests/user";
import { UserInfoProvider } from "../providers/UserInfoProvider";

export function UserProfilePage() {
  const authContext = useAuthContext();

  const [productList, setProductList] = useState<Product[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [orderList, setOrderList] = useState<Order[]>([]);

  useEffect(() => {
    if(authContext.loadingAuth || !authContext.signedIn) {
      return;
    }

    async function getOrderData(): Promise<void> {
      try {
        setProductList(await getProductList());
        setOrderList(await getUserOrders(localStorage.getItem("jwtToken")))
        setOrdersLoading(false);
      } catch (err) {
        console.error(err);
      }
    }
    
    getOrderData();
  }, [authContext.loadingAuth]);

  if(authContext.loadingAuth) {
    return <LoadingMessage text="Загрузка данных пользователя..." heightVH={100}></LoadingMessage>
  }

  if(!authContext.signedIn) {
    return <Navigate to="/home" replace></Navigate>
  }

  return (
    <ProductListContext.Provider value={productList}>
      <OrderListContext.Provider value={orderList}>
        <UserInfoProvider>

          <UserProfileSection ordersLoading={ordersLoading}></UserProfileSection>

        </UserInfoProvider>
      </OrderListContext.Provider>
    </ProductListContext.Provider>
  )
}