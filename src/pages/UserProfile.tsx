import { User } from "../classes/user";
import { Footer, NavigationBar } from "../components/componentsCommon";
import { OrderCard, OrdersList, UserInfo, UserProfileSection } from "../components/componentsUserProfile";
import { Order } from "../classes/order";
import { Product } from "../classes/product";

import userLogoImage from "../assets/defaultUserLogo.png";
import earringsMetalImage from "../assets/productImages/earringsMetal.png";

export function UserProfile() {
  const product1: Product = new Product("Серьги металл", 399, "https://www.youtube.com/watch?v=dQw4w9WgXcQ", 1, [earringsMetalImage]);

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <UserProfileSection>
          <UserInfo user={new User("Полина", "Костина", undefined, undefined, userLogoImage)}></UserInfo>
          <OrdersList>
            <OrderCard order={new Order(product1, product1.price, "В пути")}></OrderCard>
          </OrdersList>
        </UserProfileSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}