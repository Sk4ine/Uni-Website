import { BrowserRouter } from "react-router";
import { getProductList } from "../../api/requests/products";
import { CatalogPage } from "./CatalogPage";
import { render } from "@testing-library/react";
import { ActiveCategoryContext } from "../../contexts/activeCategoryContext";
import type { Mock } from "vitest";
import { getCategoryList } from "../../api/requests/categories";
import { act } from "react";

vi.mock("../../api/requests/products", () => ({
  getProductList: vi.fn(),
}));

vi.mock("../../api/requests/categories", () => ({
  getCategoryList: vi.fn(),
}));

describe("Catalog Page", () => {
  test("useEffect API calls are made successfuly", async () => {
    (getProductList as Mock).mockResolvedValue([]);
    (getCategoryList as Mock).mockResolvedValue([]);

    await act(async () => {
      render(
        <BrowserRouter>
          <ActiveCategoryContext.Provider
            value={{ activeCategory: 1, setActiveCategory: () => {} }}
          >
            <CatalogPage />
          </ActiveCategoryContext.Provider>
        </BrowserRouter>,
      );
    });

    expect(getProductList).toBeCalledTimes(1);
    expect(getCategoryList).toBeCalledTimes(1);
  });
});
