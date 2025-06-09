import { createContext, useContext } from "react"
import type { TableData } from "../providers/AdminPanelProvider";
import type { Product } from "../classes/product";
import type { ProductCategory } from "../classes/productCategory";

interface AdminPanelContextType {
  activeTable: string,
  tableData: TableData,
  tableRecords: ProductCategory[] | Product[],
  loadingRecords: boolean,
  editIsOpen: boolean,
  setEditIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  selectedRecord: number,
  setSelectedRecord: React.Dispatch<React.SetStateAction<number>>,
  switchActiveTable: (tableName: string) => void,
  updateTableRecords: (waitForLoad: boolean) => Promise<void>,
  deleteIsOpen: boolean,
  setDeleteIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
}

export const AdminPanelContext: React.Context<AdminPanelContextType | undefined> = createContext<AdminPanelContextType | undefined>(undefined);

export const useAdminPanelContext = (): AdminPanelContextType => {
  const context = useContext(AdminPanelContext);
  if (context === undefined) {
    throw new Error('useAdminPanelContext must be used within a AdminPanelProvider');
  }
  return context;
};