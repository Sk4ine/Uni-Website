import { act, render } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { HomePage } from "./HomePage";
import { getProductList } from "../../api/requests/products";
import { ActiveCategoryContext } from "../../contexts/activeCategoryContext";
import type { Mock } from "vitest";

vi.mock("../../api/requests/products", () => ({
  getProductList: vi.fn(),
}));

describe("Home Page", () => {
  test("useEffect API calls are made successfuly", async () => {
    (getProductList as Mock).mockResolvedValue([]);

    await act(async () => {
      render(
        <BrowserRouter>
          <ActiveCategoryContext.Provider
            value={{ activeCategory: 1, setActiveCategory: () => {} }}
          >
            <HomePage />
          </ActiveCategoryContext.Provider>
        </BrowserRouter>,
      );
    });

    expect(getProductList).toBeCalledTimes(1);
  });
});
