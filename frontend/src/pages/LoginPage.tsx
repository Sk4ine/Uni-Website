import { ContentWrapper, PageWrapper } from "../components/Common";
import { EmptySpace, HomePageButton, LoginSection, NavigationSection } from "../components/LoginForm";

export function LoginPage() {
  return (
    <PageWrapper>
      <NavigationSection></NavigationSection>
      <ContentWrapper>
        <LoginSection></LoginSection>
      </ContentWrapper>
    </PageWrapper>
  )
}