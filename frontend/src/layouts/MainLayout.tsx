import { Outlet } from "react-router";
import { ContentWrapper, Footer, PageWrapper } from "../components/Common";
import { NavigationBar } from "../components/NavigationBar";

export function MainLayout() {
  return (
    <PageWrapper>
      <NavigationBar></NavigationBar>

      <ContentWrapper>
        <Outlet />
      </ContentWrapper>

      <Footer phoneNumber="8 999 999 99 99" address="г. Иваново"></Footer>
    </PageWrapper>
  )
}