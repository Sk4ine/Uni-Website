import { Navigate, useNavigate } from "react-router";
import { AdminNavigationBar } from "../components/AdminNavigationBar";
import { useEffect, useState } from "react";
import { ActiveTableContext } from "../contexts/activeTableContext";
import { LoadingMessage, PageWrapper } from "../components/Common";
import { useAuthContext } from "../contexts/authContext";
import { DatabaseEditSection } from "../components/AdminPanel";

export function AdminPanelPage() {
  const [activeTable, setActiveTable] = useState<string>("categories");
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
    <>
      {authContext.loadingAuth ? (
        <LoadingMessage text={"Загрузка прав доступа..."} heightVH={100}></LoadingMessage>
      ) : (
        <ActiveTableContext value={{activeTable, setActiveTable}}>
          <PageWrapper>
            <AdminNavigationBar></AdminNavigationBar>
            <DatabaseEditSection></DatabaseEditSection>
          </PageWrapper>
        </ActiveTableContext>
      )}
    </>
  )
}