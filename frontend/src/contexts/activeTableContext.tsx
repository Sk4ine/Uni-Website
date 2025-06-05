import { createContext, useContext } from "react";

type ActiveTableContextType = {
  activeTable: string;
  setActiveTable: React.Dispatch<React.SetStateAction<string>>;
}

export const ActiveTableContext = createContext<ActiveTableContextType | undefined>(undefined);

export const useActiveTableContext = (): ActiveTableContextType => {
  const context = useContext(ActiveTableContext);
  if (context === undefined) {
    throw new Error('useActiveTableContext must be used within a CartProvider');
  }
  return context;
};