import { useEffect, useState } from "react";
import { AdminPanelContext } from "../contexts/adminPanelContext";
import type { Product } from "../classes/product";
import type { ProductCategory } from "../classes/productCategory";
import { getTableRecords } from "../api/requests/admin";

export interface TableData {
  name: string;
  header: string;
}

export interface Record {
  [key: string]: any;
}

export function AdminPanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const tableList: TableData[] = [
    { name: "categories", header: "Категория" },
    { name: "products", header: "Продукт" },
  ];

  const [activeTable, setActiveTable] = useState<string>(tableList[0].name);
  const [tableData, setTableData] = useState<TableData>(tableList[0]);
  const [tableRecords, setTableRecords] = useState<
    ProductCategory[] | Product[]
  >([]);
  const [loadingRecords, setLoadingRecords] = useState<boolean>(true);
  const [editIsOpen, setEditIsOpen] = useState<boolean>(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<number>(0);

  useEffect(() => {
    async function updateRecords(): Promise<void> {
      try {
        await updateTableRecords();
      } catch (error) {
        console.log(error);
      }
    }

    updateRecords();
  }, [activeTable]);

  const switchActiveTable = (tableName: string): void => {
    const tableSearch: TableData | undefined = tableList.find(
      (data) => data.name == tableName,
    );
    if (!tableSearch) {
      throw new Error("Attempt to set active non-existing table");
    }

    setLoadingRecords(true);
    setActiveTable(tableName);
    setTableData(tableSearch);
  };

  const updateTableRecords = async (
    waitForLoad: boolean = true,
  ): Promise<void> => {
    if (waitForLoad) {
      setLoadingRecords(true);
    }

    try {
      setTableRecords(await getTableRecords(activeTable));
      setLoadingRecords(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AdminPanelContext.Provider
      value={{
        activeTable,
        tableData,
        tableRecords,
        loadingRecords,
        editIsOpen,
        selectedRecord,
        setSelectedRecord,
        setEditIsOpen,
        switchActiveTable,
        updateTableRecords,
        deleteIsOpen,
        setDeleteIsOpen,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
}
