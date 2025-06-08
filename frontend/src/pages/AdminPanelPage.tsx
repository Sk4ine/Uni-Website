import { Navigate } from "react-router";
import { AdminNavigationBar } from "../components/AdminNavigationBar";
import { useEffect, useState } from "react";
import { ContentWrapper, LoadingMessage, PageWrapper } from "../components/Common";
import { useAuthContext } from "../contexts/authContext";
import { DatabaseEditSection } from "../components/AdminPanel";
import { AdminPanelProvider } from "../providers/AdminPanelProvider";

export function AdminPanelPage() {
  const [checkedAdmin, setCheckedAdmin] = useState<boolean>(false);
  const authContext = useAuthContext();

  useEffect(() => {
    if(authContext.loadingAuth || !authContext.signedIn) {
      return;
    }

    async function performAdminCheck() {
      await authContext.checkIsAdmin();
      setCheckedAdmin(true);
    }

    if(!checkedAdmin) {
      performAdminCheck();
    }

    
  }, [authContext.loadingAuth]);

  if(authContext.loadingAuth) {
    return <LoadingMessage text={"Загрузка прав доступа..."} heightVH={100}></LoadingMessage>;
  }

  if(!authContext.signedIn) {
    return <Navigate to="/home" replace></Navigate>;
  }

  if(checkedAdmin && !authContext.isAdmin) {
    return <Navigate to="/home" replace></Navigate>;
  }

  return (
    <PageWrapper>
      {authContext.loadingAuth ? (
        <LoadingMessage text={"Загрузка прав доступа..."} heightVH={100}></LoadingMessage>
      ) : (
        <AdminPanelProvider>
          <ContentWrapper>
            <AdminNavigationBar></AdminNavigationBar>
            <DatabaseEditSection></DatabaseEditSection>
          </ContentWrapper>
        </AdminPanelProvider>
      )}
    </PageWrapper>
  )
}