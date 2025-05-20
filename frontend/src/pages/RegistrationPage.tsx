import { EmptySpace, HomePageButton } from "../components/componentsLoginPage";
import { RegistrationSection } from "../components/componentsRegistrationPage";

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