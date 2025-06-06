import { useContext } from "react";
import { CategoryListContext } from "../contexts/otherContexts";
import { ProductList } from "./Common";
import { useActiveCategoryContext } from "../contexts/activeCategoryContext";

export function CatalogSection() {
  return(
    <div className="flex flex-col items-center">
      <CategoryList></CategoryList>
      <ProductList></ProductList>
      <ShowMoreButtonCatalog></ShowMoreButtonCatalog>
    </div>
  )
}

function CategoryList() {
  const categoryListContext = useContext(CategoryListContext);
  const activeCategoryContext = useActiveCategoryContext();

  const categoryButtonList: React.ReactNode[] = [];

  categoryButtonList.push(<CategoryButton key={0} categoryID={0} categoryName="Всё" active={activeCategoryContext.activeCategory == 0 ? true : false}></CategoryButton>)

  for(let i = 0; i < categoryListContext.length; i++) {
    categoryButtonList.push(<CategoryButton key={i + 1} categoryID={categoryListContext[i].id} categoryName={categoryListContext[i].name} active={categoryListContext[i].id == activeCategoryContext.activeCategory ? true : false}></CategoryButton>);
  }

  return (
    <div className="flex flex-wrap justify-center items-center gap-5 w-[1344px] mt-10">
      {categoryButtonList}
    </div>
  )
}

function CategoryButton({categoryID, categoryName, active} : {categoryID: number, categoryName: string, active: boolean}) {
  const backgroundColor: string = active ? "bg-[#F5D4D5]" : "bg-[#E2E2E2]";
  const textColor: string = active ? "text-[#EF829A]" : "text-[#979797]";
  const backgroundHoverColor: string = active ? "hover:bg-[#E6C8C9]" : "hover:bg-[#D1D1D1]";

  const activeCategoryContext = useActiveCategoryContext();

  function handleClick() {
    activeCategoryContext.setActiveCategory(categoryID);
  }
  
  return (
    <button onClick={handleClick} className={`${backgroundColor} ${textColor} ${backgroundHoverColor} font-default text-3xl w-64 py-1 flex justify-center items-center rounded-2xl cursor-pointer`}>{categoryName}</button>
  )
}

function ShowMoreButtonCatalog() {
  return (
    <button className="font-default text-3xl text-[#EF829A] hover:text-[#D9758B] flex justify-center items-center mt-10 cursor-pointer">Показать ещё</button>
  )
}