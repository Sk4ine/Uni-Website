import { useEffect } from "react";
import { ContentWrapper, LoadingMessage, PageWrapper } from "../components/Common";
import { LoginSection, NavigationSection } from "../components/LoginForm";
import { useAuthContext } from "../contexts/authContext";
import { Navigate, useNavigate } from "react-router";

export function LoginPage() {
  const authContext = useAuthContext();

  if(authContext.loadingAuth) {
    return <LoadingMessage text="Загрузка данных пользователя..." heightVH={100}></LoadingMessage>
  }

  if(authContext.signedIn) {
    return <Navigate to="/user-profile" replace></Navigate>
  }

  return (
    <PageWrapper>
      <NavigationSection></NavigationSection>
      <ContentWrapper>
        <LoginSection></LoginSection>
      </ContentWrapper>
    </PageWrapper>
  )
}