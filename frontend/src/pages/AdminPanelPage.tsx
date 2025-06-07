import { useNavigate } from "react-router";
import { AdminNavigationBar, DatabaseEditSection } from "../components/AdminNavigationBar";
import { useEffect, useState } from "react";
import { ActiveTableContext } from "../contexts/activeTableContext";
import { LoadingMessage, PageWrapper } from "../components/Common";
import { useAuthContext } from "../contexts/authContext";

export function AdminPanelPage() {
  const [activeTable, setActiveTable] = useState<string>("categories");
  const [checkedAdmin, setCheckedAdmin] = useState<boolean>(false);
  const authContext = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(authContext.loadingAuth) {
      return;
    }

    if(!checkedAdmin) {
      authContext.checkIsAdmin();
      setCheckedAdmin(true);
    }

    if(!authContext.signedIn || !authContext.isAdmin) {
      navigate("/home");
      return;
    }

  }, [authContext.isAdmin])

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