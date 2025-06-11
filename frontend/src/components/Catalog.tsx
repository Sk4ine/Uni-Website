import { useContext } from "react";
import { CategoryListContext, IsLoadingContext } from "../contexts/otherContexts";
import { ProductList } from "./Common";
import { useActiveCategoryContext } from "../contexts/activeCategoryContext";

export function CatalogSection() {
  return (
    <div className="flex flex-col items-center">
      <CategoryList></CategoryList>
      <ProductList sortByCategory={true}></ProductList>
      <ShowMoreButtonCatalog></ShowMoreButtonCatalog>
    </div>
  );
}

function CategoryList() {
  const categoryListContext = useContext(CategoryListContext);
  const activeCategoryContext = useActiveCategoryContext();
  const isLoading: boolean = useContext(IsLoadingContext);

  const categoryButtonList: React.ReactNode[] = categoryListContext.map((category, index) => (
    <CategoryButton
      key={index}
      categoryID={category.id}
      categoryName={category.name}
      active={category.id == activeCategoryContext.activeCategory ? true : false}
    ></CategoryButton>
  ));

  return (
    <div className="flex flex-wrap justify-center items-center gap-5 w-[1344px] mt-10">
      {isLoading || categoryButtonList.length === 0
        ? [...Array(4)].map((_, index) => <LoadingCategoryButton key={index} />)
        : categoryButtonList}
    </div>
  );
}

function CategoryButton({
  categoryID,
  categoryName,
  active,
}: {
  categoryID: number;
  categoryName: string;
  active: boolean;
}) {
  const backgroundColor: string = active ? "bg-[#F5D4D5]" : "bg-[#E2E2E2]";
  const textColor: string = active ? "text-[#EF829A]" : "text-[#979797]";
  const backgroundHoverColor: string = active ? "hover:bg-[#E6C8C9]" : "hover:bg-[#D1D1D1]";

  const activeCategoryContext = useActiveCategoryContext();

  function handleClick() {
    activeCategoryContext.setActiveCategory(categoryID);
  }

  return (
    <button
      onClick={handleClick}
      className={`${backgroundColor} ${textColor} ${backgroundHoverColor} font-default text-3xl w-64 py-1 flex justify-center items-center rounded-2xl cursor-pointer animate-fade-in`}
    >
      {categoryName}
    </button>
  );
}

function LoadingCategoryButton() {
  return (
    <div className="w-64 h-10 py-1 from-[#D9D9D9]/75 via-[#D9D9D9]/50 to-[#D9D9D9]/75 animate-pulse rounded-2xl bg-linear-to-tr" />
  );
}

function ShowMoreButtonCatalog() {
  return (
    <button className="font-default text-3xl text-[#EF829A] hover:text-[#D9758B] flex justify-center items-center mt-10 cursor-pointer">
      Показать ещё
    </button>
  );
}
