import { render, screen } from "@testing-library/react";
import { CategoryList } from "./Catalog";
import { ActiveCategoryContext } from "../contexts/activeCategoryContext";
import { CategoryListContext, IsLoadingContext } from "../contexts/otherContexts";
import { ProductCategory } from "../classes/productCategory";
import userEvent from "@testing-library/user-event";

describe("CategoryList Component", () => {
  const testCategory1: ProductCategory = new ProductCategory(1, "testCategory1");
  const testCategory2: ProductCategory = new ProductCategory(2, "testCategory2");

  test("Placeholder buttons are displayed while loading categories", () => {
    render(
      <ActiveCategoryContext.Provider value={{ activeCategory: 1, setActiveCategory: () => {} }}>
        <CategoryListContext.Provider value={[testCategory1, testCategory2]}>
          <IsLoadingContext.Provider value={true}>
            <CategoryList />
          </IsLoadingContext.Provider>
        </CategoryListContext.Provider>
      </ActiveCategoryContext.Provider>,
    );

    const loadingButtons = screen.getAllByTestId("loading-button");
    expect(loadingButtons.length).toBe(4);
  });

  test("Category list is displayed correctly", () => {
    render(
      <ActiveCategoryContext.Provider value={{ activeCategory: 1, setActiveCategory: () => {} }}>
        <CategoryListContext.Provider value={[testCategory1, testCategory2]}>
          <IsLoadingContext.Provider value={false}>
            <CategoryList />
          </IsLoadingContext.Provider>
        </CategoryListContext.Provider>
      </ActiveCategoryContext.Provider>,
    );

    const categoryButtons = screen.getAllByRole("button");
    expect(categoryButtons.length).toBe(2);

    expect(categoryButtons[0]).toHaveTextContent(testCategory1.name);
  });

  test("Category button click changes active category", async () => {
    const mockSetActiveCategory = vi.fn();

    render(
      <ActiveCategoryContext.Provider
        value={{ activeCategory: 1, setActiveCategory: mockSetActiveCategory }}
      >
        <CategoryListContext.Provider value={[testCategory1, testCategory2]}>
          <IsLoadingContext.Provider value={false}>
            <CategoryList />
          </IsLoadingContext.Provider>
        </CategoryListContext.Provider>
      </ActiveCategoryContext.Provider>,
    );

    const button = screen.getByText(testCategory2.name);
    await userEvent.click(button);

    expect(mockSetActiveCategory).toBeCalledTimes(1);
    expect(mockSetActiveCategory).toBeCalledWith(2);
  });
});
