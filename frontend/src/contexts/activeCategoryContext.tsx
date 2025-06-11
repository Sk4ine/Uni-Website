import { createContext, useContext } from "react";

type ActiveCategoryContextType = {
  activeCategory: number;
  setActiveCategory: React.Dispatch<React.SetStateAction<number>>;
};

export const ActiveCategoryContext: React.Context<
  ActiveCategoryContextType | undefined
> = createContext<ActiveCategoryContextType | undefined>(undefined);

export const useActiveCategoryContext = (): ActiveCategoryContextType => {
  const context = useContext(ActiveCategoryContext);
  if (context === undefined) {
    throw new Error(
      "useActiveCategoryContext must be used within a CartProvider",
    );
  }
  return context;
};
