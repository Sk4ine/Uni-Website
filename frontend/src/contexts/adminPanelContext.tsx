import { createContext, useContext } from "react"

interface AdminPanelContextType {
  activeTable: string,
  switchActiveTable: (tableName: string) => void
}

export const AdminPanelContext: React.Context<AdminPanelContextType | undefined> = createContext<AdminPanelContextType | undefined>(undefined);

export const useAdminPanelContext = (): AdminPanelContextType => {
  const context = useContext(AdminPanelContext);
  if (context === undefined) {
    throw new Error('useAdminPanelContext must be used within a AdminPanelProvider');
  }
  return context;
};