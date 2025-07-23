import { LoadingMessage } from "../../components/Common";
import { LoginSection } from "../../components/LoginForm";
import { Navigate } from "react-router";
import { useLoadingAuth, useSignedIn } from "../../stores/authStore";

export function LoginPage() {
  const loadingAuth: boolean = useLoadingAuth();
  const signedIn: boolean = useSignedIn();

  if (loadingAuth) {
    return <LoadingMessage text="Загрузка данных пользователя..." heightVH={100} />;
  }

  if (signedIn) {
    return <Navigate to="/user-profile" replace />;
  }

  return (
    <>
      <LoginSection />
    </>
  );
}
