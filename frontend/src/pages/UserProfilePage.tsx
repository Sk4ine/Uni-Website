import { useEffect, useState } from "react";
import { ContentWrapper, Footer, PageWrapper } from "../components/Common";
import { UserProfileSection } from "../components/UserProfile";
import { OrderListContext, ProductListContext } from "../contexts/otherContexts";
import { Navigate, useNavigate } from "react-router";
import { Order } from "../classes/order";
import type { Product } from "../classes/product";
import { getProductList } from "../api/requests/products";
import { NavigationBar } from "../components/NavigationBar";
import { useAuthContext } from "../contexts/authContext";
import type { User } from "../classes/user";
import { getUserInfo, getUserOrders } from "../api/requests/user";
import { UserInfoContext } from "../contexts/userInfoContext";
import { UserInfoProvider } from "../providers/UserInfoProvider";
import { AuthProvider } from "../providers/AuthProvider";

export function UserProfilePage() {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  const [productList, setProductList] = useState<Product[]>([]);
  const [ordersLoading, setOrdersLoading] = useState<boolean>(true);
  const [orderList, setOrderList] = useState<Order[]>([]);

  useEffect(() => {
    if(authContext.loadingAuth) {
      return;
    }

    if(!authContext.signedIn) {
      navigate("/home");
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

  return (
    <ProductListContext.Provider value={productList}>
      <OrderListContext.Provider value={orderList}>
        <UserInfoProvider>
          <PageWrapper>
            <NavigationBar></NavigationBar>

            <ContentWrapper>
              <UserProfileSection ordersLoading={ordersLoading}></UserProfileSection>
            </ContentWrapper>
            
            <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
          </PageWrapper>
        </UserInfoProvider>
      </OrderListContext.Provider>
    </ProductListContext.Provider>
  )
}