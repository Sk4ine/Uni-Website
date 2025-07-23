import { create } from "zustand";
import { Product } from "../classes/product";
import { ProductCategory } from "../classes/productCategory";
import { getTableRecords } from "../api/requests/admin";

export interface TableData {
  name: string;
  header: string;
}

interface AdminPanelState {
  tableList: TableData[];
  activeTable: string;
  tableData: TableData;
  tableRecords: ProductCategory[] | Product[];
  loadingRecords: boolean;
  editIsOpen: boolean;
  deleteIsOpen: boolean;
  selectedRecord: number;
  setSelectedRecord: (value: number) => void;
  setEditIsOpen: (value: boolean) => void;
  setDeleteIsOpen: (value: boolean) => void;
  switchActiveTable: (tableName: string) => void;
  updateTableRecords: (waitForLoad?: boolean) => Promise<void>;
}

const defaultTableList: TableData[] = [
  { name: "categories", header: "Категория" },
  { name: "products", header: "Продукт" },
];

const useAdminPanelStore = create<AdminPanelState>((set, get) => ({
  tableList: defaultTableList,
  activeTable: defaultTableList[0].name,
  tableData: defaultTableList[0],
  tableRecords: [],
  loadingRecords: true,
  editIsOpen: false,
  deleteIsOpen: false,
  selectedRecord: 0,

  setSelectedRecord: (value: number): void => {
    set({ selectedRecord: value });
  },

  setEditIsOpen: (value: boolean): void => {
    set({ editIsOpen: value });
  },
  setDeleteIsOpen: (value: boolean): void => {
    set({ deleteIsOpen: value });
  },

  switchActiveTable: (tableName: string): void => {
    const tableSearch: TableData | undefined = get().tableList.find(
      (data) => data.name == tableName,
    );
    if (!tableSearch) {
      throw new Error("Attempt to set active non-existing table");
    }

    set({ loadingRecords: true, activeTable: tableName, tableData: tableSearch });
  },

  updateTableRecords: async (waitForLoad: boolean = true): Promise<void> => {
    if (waitForLoad) {
      set({ loadingRecords: true });
    }

    const updatedRecords = await getTableRecords(get().activeTable);
    set({ tableRecords: updatedRecords, loadingRecords: false });
  },
}));

let currentActiveTable: string = useAdminPanelStore.getState().activeTable;

useAdminPanelStore.subscribe((state) => {
  if (state.activeTable !== currentActiveTable) {
    currentActiveTable = state.activeTable;
    state.updateTableRecords();
  }
});

export const useActiveTable = (): string => useAdminPanelStore((state) => state.activeTable);
export const useTableData = (): TableData => useAdminPanelStore((state) => state.tableData);
export const useTableRecords = (): ProductCategory[] | Product[] =>
  useAdminPanelStore((state) => state.tableRecords);
export const useLoadingRecords = (): boolean => useAdminPanelStore((state) => state.loadingRecords);
export const useEditIsOpen = (): boolean => useAdminPanelStore((state) => state.editIsOpen);
export const useDeleteIsOpen = (): boolean => useAdminPanelStore((state) => state.deleteIsOpen);
export const useSelectedRecord = (): number => useAdminPanelStore((state) => state.selectedRecord);

export const useSetEditIsOpen = (): ((isOpen: boolean) => void) =>
  useAdminPanelStore((state) => state.setEditIsOpen);
export const useSetDeleteIsOpen = (): ((isOpen: boolean) => void) =>
  useAdminPanelStore((state) => state.setDeleteIsOpen);
export const useSetSelectedRecord = (): ((recordId: number) => void) =>
  useAdminPanelStore((state) => state.setSelectedRecord);
export const useUpdateTableRecords = (): ((waitForLoad?: boolean) => Promise<void>) =>
  useAdminPanelStore((state) => state.updateTableRecords);
export const useSwitchActiveTable = (): ((tableName: string) => void) =>
  useAdminPanelStore((state) => state.switchActiveTable);
