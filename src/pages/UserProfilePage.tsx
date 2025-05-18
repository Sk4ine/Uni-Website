import { Footer, NavigationBar } from "../components/componentsCommon";
import { OrdersList, UserInfo, UserProfileSection } from "../components/componentsUserProfile";
import { useContext } from "react";
import { CurrentUserContext } from "../components/contexts";
import { Navigate } from "react-router";

export function UserProfilePage() {
  const currentUserContext = useContext(CurrentUserContext);
  
  if(!currentUserContext) {
    return;
  }

  if(!currentUserContext.currentUser) {
    return <Navigate to="/home"></Navigate>
  }

  return (
    <>
      <div>
        <NavigationBar></NavigationBar>
        <UserProfileSection>
          <UserInfo></UserInfo>
          <OrdersList></OrdersList>
        </UserProfileSection>
        <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
      </div>
    </>
  )
}