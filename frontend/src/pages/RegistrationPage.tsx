import { ContentWrapper, PageWrapper } from "../components/Common";
import { NavigationSection } from "../components/LoginForm";
import { RegistrationSection } from "../components/RegistrationForm";

export function RegistrationPage() {
  return (
    <PageWrapper>
      <NavigationSection></NavigationSection>
      <ContentWrapper>
        <RegistrationSection></RegistrationSection>
      </ContentWrapper>
    </PageWrapper>
  )
}