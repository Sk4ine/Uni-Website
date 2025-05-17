import { useContext, useState } from "react";
import { ActiveCategoryContext, CategoryListContext } from "./contexts";

export function CategoryList() {
  const categoryListContext = useContext(CategoryListContext);

  if(!categoryListContext) {
    return;
  }

  const activeCategoryContext = useContext(ActiveCategoryContext);

  if(!activeCategoryContext) {
    return;
  }

  const categoryButtonList: React.ReactNode[] = [];

  for(let i = 0; i < categoryListContext.length; i++) {
    categoryButtonList.push(<CategoryButton key={i} categoryID={categoryListContext[i].id} categoryName={categoryListContext[i].name} active={categoryListContext[i].id - 1 == activeCategoryContext.activeCategory ? true : false}></CategoryButton>);
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-5 w-[1344px] mt-10">
      {categoryButtonList}
    </div>
  )
}

export function CategoryButton({categoryID, categoryName, active} : {categoryID: number, categoryName: string, active: boolean}) {
  const backgroundColor: string = active ? "bg-[#F5D4D5]" : "bg-[#E2E2E2]";
  const textColor: string = active ? "text-[#EF829A]" : "text-[#979797]";
  const backgroundHoverColor: string = active ? "hover:bg-[#E6C8C9]" : "hover:bg-[#D1D1D1]";

  const activeCategoryContext = useContext(ActiveCategoryContext);

  function handleClick() {
    if(!activeCategoryContext) {
      return;
    }

    activeCategoryContext.setActiveCategory(categoryID - 1);
  }
  
  return (
    <button onClick={handleClick} className={`${backgroundColor} ${textColor} ${backgroundHoverColor} font-default text-4xl w-64 py-1 flex justify-center items-center rounded-2xl cursor-pointer`}>{categoryName}</button>
  )
}

export function CatalogSection({children} : {children : React.ReactNode}) {
  return(
    <div className="flex flex-col items-center">
      {children}
      <ShowMoreButtonCatalog></ShowMoreButtonCatalog>
    </div>
  )
}

function ShowMoreButtonCatalog() {
  return (
    <button className="font-default text-4xl text-[#EF829A] hover:text-[#D9758B] flex justify-center items-center mt-10 cursor-pointer">Показать ещё</button>
  )
}