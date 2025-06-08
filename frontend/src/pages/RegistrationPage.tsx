import { ContentWrapper, PageWrapper } from "../components/Common";
import { HomePageButton } from "../components/LoginForm";
import { RegistrationSection } from "../components/RegistrationForm";

export function RegistrationPage() {
  return (
    <PageWrapper>
      <HomePageButton></HomePageButton>
      <ContentWrapper>
        <RegistrationSection></RegistrationSection>
      </ContentWrapper>
    </PageWrapper>
  )
}