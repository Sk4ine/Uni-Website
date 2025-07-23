import { act, render, screen } from "@testing-library/react";
import { ErrorMessageContext, IsLoadingContext } from "../../contexts/otherContexts";
import { CartSection } from "../../components/Cart";
import { useCartStore } from "../../stores/cartStore";
import { Product } from "../../classes/product";
import { getProductByID } from "../../api/requests/products";
import type { Mock } from "vitest";
import { BrowserRouter } from "react-router";
import { CheckoutProductContext } from "../../contexts/checkoutProductContext";
import userEvent from "@testing-library/user-event";
import { CartPage } from "./CartPage";

const testProduct: Product = new Product(1, 1, "testProduct", 299, ["material"], 5, 4, "Unknown");

vi.mock("../../api/requests/products", () => ({
  getProductByID: vi.fn(),
}));

const mockedUseNavigate = vi.fn();
vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    useNavigate: () => mockedUseNavigate,
  };
});

describe("Cart Page", () => {
  describe("CartSection Component", () => {
    beforeEach(() => {
      useCartStore.setState({ cartProductList: [], catalogProductList: [] });
    });

    test("CartProductList renders correctly", async () => {
      (getProductByID as Mock).mockResolvedValue(testProduct);

      useCartStore.getState().addProduct(testProduct.id);
      await useCartStore.getState().updateCatalogProductList();

      await act(async () => {
        render(
          <BrowserRouter>
            <CheckoutProductContext.Provider
              value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
            >
              <IsLoadingContext.Provider value={false}>
                <ErrorMessageContext.Provider value="">
                  <CartSection />
                </ErrorMessageContext.Provider>
              </IsLoadingContext.Provider>
            </CheckoutProductContext.Provider>
          </BrowserRouter>,
        );
      });

      expect(getProductByID).toBeCalledWith(testProduct.id);

      const imageLink = screen.getByRole("link");
      expect(imageLink).toHaveAttribute("href", `/catalog/${testProduct.id}`);
    });

    test("Placeholder products are displayed while loading data", async () => {
      await act(async () => {
        render(
          <BrowserRouter>
            <CheckoutProductContext.Provider
              value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
            >
              <IsLoadingContext.Provider value={true}>
                <ErrorMessageContext.Provider value="">
                  <CartSection />
                </ErrorMessageContext.Provider>
              </IsLoadingContext.Provider>
            </CheckoutProductContext.Provider>
          </BrowserRouter>,
        );
      });

      const loadingProduct = screen.getAllByTestId("loading-product");
      expect(loadingProduct.length).toBe(2);
    });

    test("Display a message if the cart if empty", () => {
      render(
        <BrowserRouter>
          <CheckoutProductContext.Provider
            value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
          >
            <IsLoadingContext.Provider value={false}>
              <ErrorMessageContext.Provider value="">
                <CartSection />
              </ErrorMessageContext.Provider>
            </IsLoadingContext.Provider>
          </CheckoutProductContext.Provider>
        </BrowserRouter>,
      );

      expect(screen.getByText("Корзина пуста"));
    });

    test("ErrorMessage is displayed if it isn't null", () => {
      render(
        <BrowserRouter>
          <CheckoutProductContext.Provider
            value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
          >
            <IsLoadingContext.Provider value={false}>
              <ErrorMessageContext.Provider value="Unknown error">
                <CartSection />
              </ErrorMessageContext.Provider>
            </IsLoadingContext.Provider>
          </CheckoutProductContext.Provider>
        </BrowserRouter>,
      );

      expect(screen.getByText("Unknown error"));
    });

    test("Product quantity changes on button press", async () => {
      (getProductByID as Mock).mockResolvedValue(testProduct);

      useCartStore.getState().addProduct(testProduct.id);
      await useCartStore.getState().updateCatalogProductList();

      render(
        <BrowserRouter>
          <CheckoutProductContext.Provider
            value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
          >
            <IsLoadingContext.Provider value={false}>
              <ErrorMessageContext.Provider value="">
                <CartSection />
              </ErrorMessageContext.Provider>
            </IsLoadingContext.Provider>
          </CheckoutProductContext.Provider>
        </BrowserRouter>,
      );

      const increaseQuantityButton = screen.getByRole("button", { name: "+" });
      const decreaseQuantityButton = screen.getByRole("button", { name: "-" });
      const quantityCounter = screen.getByTestId("quantity-counter");

      await userEvent.click(increaseQuantityButton);

      expect(quantityCounter).toHaveTextContent("2");
      expect(decreaseQuantityButton).not.toHaveAttribute("disabled");

      await userEvent.click(decreaseQuantityButton);

      expect(quantityCounter).toHaveTextContent("1");
      expect(decreaseQuantityButton).toHaveAttribute("disabled");
    });

    test("Product is removed on button click", async () => {
      (getProductByID as Mock).mockResolvedValue(testProduct);

      useCartStore.getState().addProduct(testProduct.id);
      await useCartStore.getState().updateCatalogProductList();

      render(
        <BrowserRouter>
          <CheckoutProductContext.Provider
            value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
          >
            <IsLoadingContext.Provider value={false}>
              <ErrorMessageContext.Provider value="">
                <CartSection />
              </ErrorMessageContext.Provider>
            </IsLoadingContext.Provider>
          </CheckoutProductContext.Provider>
        </BrowserRouter>,
      );

      const removeProductButton = screen.getByRole("button", { name: "Удалить товар" });

      await userEvent.click(removeProductButton);

      expect(screen.queryByText("testProduct")).not.toBeInTheDocument();
    });

    test("Checkout button works correctly", async () => {
      (getProductByID as Mock).mockResolvedValue(testProduct);

      useCartStore.getState().addProduct(testProduct.id);
      await useCartStore.getState().updateCatalogProductList();

      render(
        <BrowserRouter>
          <CheckoutProductContext.Provider
            value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
          >
            <IsLoadingContext.Provider value={false}>
              <ErrorMessageContext.Provider value="">
                <CartSection />
              </ErrorMessageContext.Provider>
            </IsLoadingContext.Provider>
          </CheckoutProductContext.Provider>
        </BrowserRouter>,
      );

      const checkoutButton = screen.getByRole("button", { name: "Оформить заказ" });
      await userEvent.click(checkoutButton);

      expect(mockedUseNavigate).toBeCalledWith("/checkout");
    });
  });

  describe("CartPage render", () => {
    test("CartPage API calls are made successfuly", async () => {
      (getProductByID as Mock).mockResolvedValue(testProduct);

      await act(async () => {
        useCartStore.getState().addProduct(testProduct.id);
      });

      await useCartStore.getState().updateCatalogProductList();

      await act(async () => {
        render(
          <BrowserRouter>
            <CheckoutProductContext.Provider
              value={{ checkoutProduct: undefined, setCheckoutProduct: vi.fn() }}
            >
              <CartPage />
            </CheckoutProductContext.Provider>
          </BrowserRouter>,
        );
      });
    });
  });
});
