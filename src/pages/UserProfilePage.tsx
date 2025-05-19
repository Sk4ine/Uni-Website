import { Footer, NavigationBar } from "../components/componentsCommon";
import { OrdersList, UserInfo, UserProfileSection } from "../components/componentsUserProfile";
import { useCurrentUserContext } from "../components/contexts";
import { Navigate } from "react-router";

export function UserProfilePage() {
  const currentUserContext = useCurrentUserContext();

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