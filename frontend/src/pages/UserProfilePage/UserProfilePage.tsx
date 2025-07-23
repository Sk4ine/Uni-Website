import { useEffect, useState } from "react";
import { LoadingMessage } from "../../components/Common";
import { UserProfileSection } from "../../components/UserProfile";
import { OrderListContext, ProductListContext } from "../../contexts/otherContexts";
import { Navigate } from "react-router";
import { Order } from "../../classes/order";
import type { Product } from "../../classes/product";
import { getProductList } from "../../api/requests/products";
import { getUserOrders } from "../../api/requests/user";
import { useLoadingAuth, useSignedIn } from "../../stores/authStore";
import { useIntializeUserInfo } from "../../stores/userInfoStore";

export function UserProfilePage() {
  const initializeUserInfo = useIntializeUserInfo();

  const loadingAuth: boolean = useLoadingAuth();
  const signedIn: boolean = useSignedIn();

  const [productList, setProductList] = useState<Product[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [orderList, setOrderList] = useState<Order[]>([]);

  useEffect(() => {
    if (loadingAuth || !signedIn) {
      return;
    }

    async function getOrderData(): Promise<void> {
      try {
        setProductList(await getProductList());
        setOrderList(await getUserOrders());
        setOrdersLoading(false);
      } catch (err) {
        console.error(err);
      }
    }

    initializeUserInfo();
    getOrderData();
  }, [loadingAuth, signedIn, initializeUserInfo]);

  if (loadingAuth) {
    return <LoadingMessage text="Загрузка данных пользователя..." heightVH={100}></LoadingMessage>;
  }

  if (!signedIn) {
    return <Navigate to="/home" replace></Navigate>;
  }

  return (
    <ProductListContext.Provider value={productList}>
      <OrderListContext.Provider value={orderList}>
        <UserProfileSection ordersLoading={ordersLoading} />
      </OrderListContext.Provider>
    </ProductListContext.Provider>
  );
}
