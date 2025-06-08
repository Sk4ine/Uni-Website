import { useState } from "react"
import { AdminPanelContext } from "../contexts/adminPanelContext";

export function AdminPanelProvider({children} : {children: React.ReactNode}) {
  const tableList: string[] = ["categories", "products"] 
  const [activeTable, setActiveTable] = useState<string>(tableList[0]);

  const switchActiveTable = (tableName: string): void => {
    if (!tableList.find(name => name == tableName)) {
      throw new Error("Attempt to set active non-existing table")
    }

    setActiveTable(tableName);
  }

  return (
    <AdminPanelContext.Provider value={{activeTable, switchActiveTable}}>
      {children}
    </AdminPanelContext.Provider>
  )
}