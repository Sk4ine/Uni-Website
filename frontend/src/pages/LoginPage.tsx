import { useEffect } from "react";
import { ContentWrapper, PageWrapper } from "../components/Common";
import { LoginSection, NavigationSection } from "../components/LoginForm";
import { useAuthContext } from "../contexts/authContext";
import { useNavigate } from "react-router";

export function LoginPage() {
  const authContext = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(authContext.loadingAuth) {
      return;
    }

    if(authContext.signedIn) {
      navigate("/user-profile");
      return;
    }
  }, [authContext.loadingAuth]);

  return (
    <PageWrapper>
      <NavigationSection></NavigationSection>
      <ContentWrapper>
        <LoginSection></LoginSection>
      </ContentWrapper>
    </PageWrapper>
  )
}