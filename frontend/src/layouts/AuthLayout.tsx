import { Outlet } from "react-router";
import { ContentWrapper, PageWrapper } from "../components/Common";
import { NavigationSection } from "../components/LoginForm";

export function AuthLayout() {
  return (
    <PageWrapper>
      <NavigationSection />
      <ContentWrapper>
        <Outlet />
      </ContentWrapper>
    </PageWrapper>
  );
}
