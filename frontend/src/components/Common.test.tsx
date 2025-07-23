import { render, screen } from "@testing-library/react";
import { Footer, InputField, ProductCard, ProductList } from "./Common";
import { Product } from "../classes/product";
import { BrowserRouter } from "react-router";
import userEvent from "@testing-library/user-event";
import { IsLoadingContext, ProductListContext } from "../contexts/otherContexts";
import { ActiveCategoryContext } from "../contexts/activeCategoryContext";

describe("Footer Component", () => {
  test("Footer is rendered correctly with props", () => {
    const testPhoneNumber: string = "8 999 999 99 99";
    const testAddress: string = "г. Иваново";

    render(<Footer phoneNumber={testPhoneNumber} address={testAddress} />);

    expect(screen.getByText(`Телефон: ${testPhoneNumber}`)).toBeInTheDocument();
    expect(screen.getByText(`Адрес: ${testAddress}`)).toBeInTheDocument();
  });
});

describe("ProductCard Component", () => {
  const testProduct: Product = new Product(1, 1, "testProduct", 299, ["material"], 5, 4, "Unknown");

  test("ProductCard is rendered correctly", () => {
    render(
      <BrowserRouter>
        <ProductCard product={testProduct} />
      </BrowserRouter>,
    );

    expect(screen.getByText(testProduct.name)).toBeInTheDocument();
    expect(screen.getByText(`${testProduct.price} руб.`)).toBeInTheDocument();
  });

  test("ProductCard button is changed after product added to cart", async () => {
    render(
      <BrowserRouter>
        <ProductCard product={testProduct} />
      </BrowserRouter>,
    );

    const addProductButton = screen.getByRole("button");
    await userEvent.click(addProductButton);

    const button = screen.getByTestId("cart-link");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("href", "/cart");
  });
});

describe("ProductList Component", () => {
  const testProduct: Product = new Product(1, 1, "testProduct", 299, ["material"], 5, 4, "Unknown");
  const testProduct2: Product = new Product(
    2,
    2,
    "testProduct2",
    399,
    ["material"],
    3,
    6,
    "Unknown",
  );

  test("Placeholder cards are displayed while loading data", () => {
    render(
      <ActiveCategoryContext.Provider value={{ activeCategory: 1, setActiveCategory: () => {} }}>
        <ProductListContext.Provider value={[testProduct]}>
          <IsLoadingContext.Provider value={true}>
            <ProductList />
          </IsLoadingContext.Provider>
        </ProductListContext.Provider>
      </ActiveCategoryContext.Provider>,
    );

    const loadingCard = screen.getAllByTestId("loading-card");
    expect(loadingCard.length).toBe(4);
  });

  test("Product cards displayed when the data is loaded", () => {
    render(
      <BrowserRouter>
        <ActiveCategoryContext.Provider value={{ activeCategory: 1, setActiveCategory: () => {} }}>
          <ProductListContext.Provider value={[testProduct]}>
            <IsLoadingContext.Provider value={false}>
              <ProductList />
            </IsLoadingContext.Provider>
          </ProductListContext.Provider>
        </ActiveCategoryContext.Provider>
      </BrowserRouter>,
    );

    const productCard = screen.getByText(testProduct.name);
    expect(productCard).toBeInTheDocument();
  });

  test("Only the active category products are displayed when sortByCategory is true", () => {
    render(
      <BrowserRouter>
        <ActiveCategoryContext.Provider value={{ activeCategory: 2, setActiveCategory: () => {} }}>
          <ProductListContext.Provider value={[testProduct, testProduct2]}>
            <IsLoadingContext.Provider value={false}>
              <ProductList sortByCategory={true} />
            </IsLoadingContext.Provider>
          </ProductListContext.Provider>
        </ActiveCategoryContext.Provider>
      </BrowserRouter>,
    );

    const product1Card = screen.queryByText(testProduct.name);
    const product2Card = screen.getByText(testProduct2.name);

    expect(product1Card).not.toBeInTheDocument();
    expect(product2Card).toBeInTheDocument();
  });
});

describe("InputField Component", () => {
  test("InputField is displayed properly", () => {
    render(
      <InputField
        fieldName="testField"
        fieldID="testID"
        value="defaultValue"
        required={false}
        disabled={false}
      />,
    );

    const label = screen.getByText("testField");
    expect(label).toBeInTheDocument();

    const input = screen.getByDisplayValue("defaultValue");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("name", "testID");
    expect(input).toHaveAttribute("type", "text");
    expect(input).not.toHaveAttribute("required");
    expect(input).not.toHaveAttribute("disabled");
  });

  test("InputField type is set properly", () => {
    render(
      <InputField
        fieldName="testField"
        fieldID="testID"
        value="defaultValue"
        fieldType="password"
        required={false}
        disabled={false}
      />,
    );

    const input = screen.getByDisplayValue("defaultValue");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "password");
  });
});
