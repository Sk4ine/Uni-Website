import { EmptySpace, HomePageButton } from "../components/LoginForm";
import { RegistrationSection } from "../components/RegistrationForm";

export function RegistrationPage() {
  return (
    <>
      <div>
        <HomePageButton></HomePageButton>
        <RegistrationSection></RegistrationSection>
        <EmptySpace></EmptySpace>
      </div>
    </>
  )
}