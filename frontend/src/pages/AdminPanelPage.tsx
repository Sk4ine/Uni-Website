import { useNavigate } from "react-router";
import { AdminNavigationBar, DatabaseEditSection } from "../components/AdminNavigationBar";
import { useCurrentUserContext } from "../contexts/currentUserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { ActiveTableContext } from "../contexts/activeTableContext";
import { PageWrapper } from "../components/Common";

export function AdminPanelPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTable, setActiveTable] = useState<string>("categories");
  const currentUserContext = useCurrentUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<boolean>(`http://localhost:8080/api/users/${currentUserContext.currentUser?.id}/is-admin`)
      .then(res => {
        setIsAdmin(res.data);
      })
      .catch(err => console.log(err));

  }, [])

  if(!currentUserContext.currentUser || !isAdmin) {
    navigate("/home");
    return;
  }

  return (
    <PageWrapper>
      <ActiveTableContext value={{activeTable, setActiveTable}}>
        <div>
          <AdminNavigationBar></AdminNavigationBar>
          <DatabaseEditSection></DatabaseEditSection>
        </div>
      </ActiveTableContext>
    </PageWrapper>
  )
}