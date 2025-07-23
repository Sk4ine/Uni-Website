import { Navigate } from "react-router";
import { AdminNavigationBar } from "../components/AdminNavigationBar";
import { useEffect, useState } from "react";
import { ContentWrapper, LoadingMessage, PageWrapper } from "../components/Common";
import { DatabaseEditSection } from "../components/AdminPanel";
import { useCheckIsAdmin, useIsAdmin, useLoadingAuth, useSignedIn } from "../stores/authStore";
import { useUpdateTableRecords } from "../stores/adminPanelStore";

export function AdminPanelPage() {
  const updateTableRecords = useUpdateTableRecords();

  const loadingAuth: boolean = useLoadingAuth();
  const signedIn: boolean = useSignedIn();
  const isAdmin: boolean = useIsAdmin();
  const checkIsAdmin = useCheckIsAdmin();

  const [checkedAdmin, setCheckedAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (loadingAuth || !signedIn) {
      return;
    }

    async function performAdminCheck() {
      await checkIsAdmin();
      setCheckedAdmin(true);
    }

    if (!checkedAdmin) {
      performAdminCheck();
      return;
    }

    if (isAdmin) {
      updateTableRecords();
    }
  }, [loadingAuth, checkedAdmin, checkIsAdmin, signedIn, isAdmin, updateTableRecords]);

  if (loadingAuth) {
    return <LoadingMessage text={"Загрузка прав доступа..."} heightVH={100}></LoadingMessage>;
  }

  if (!signedIn) {
    return <Navigate to="/home" replace></Navigate>;
  }

  if (checkedAdmin && !isAdmin) {
    return <Navigate to="/home" replace></Navigate>;
  }

  return (
    <PageWrapper>
      {loadingAuth ? (
        <LoadingMessage text={"Загрузка прав доступа..."} heightVH={100}></LoadingMessage>
      ) : (
        <ContentWrapper>
          <AdminNavigationBar></AdminNavigationBar>
          <DatabaseEditSection></DatabaseEditSection>
        </ContentWrapper>
      )}
    </PageWrapper>
  );
}
