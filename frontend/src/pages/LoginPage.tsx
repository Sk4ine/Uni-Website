import { LoadingMessage } from "../components/Common";
import { LoginSection } from "../components/LoginForm";
import { useAuthContext } from "../contexts/authContext";
import { Navigate } from "react-router";

export function LoginPage() {
  const authContext = useAuthContext();

  if(authContext.loadingAuth) {
    return <LoadingMessage text="Загрузка данных пользователя..." heightVH={100} />
  }

  if(authContext.signedIn) {
    return <Navigate to="/user-profile" replace />
  }

  return (
    <>
      <LoginSection />
    </>
  )
}