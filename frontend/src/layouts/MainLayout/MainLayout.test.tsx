import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { MainLayout } from "./MainLayout";
import { useCartStore } from "../../stores/cartStore";
import { CartProduct } from "../../classes/cartProduct";
import { useAuthStore } from "../../stores/authStore";
import userEvent from "@testing-library/user-event";

describe("Main Layout", () => {
  test("Navigation bar is rendered correctly", () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    const homeButton = screen.getByRole("link", { name: "Главная" });
    const catalogButton = screen.getByRole("link", { name: "Каталог" });

    expect(homeButton).toHaveAttribute("href", "/home");
    expect(catalogButton).toHaveAttribute("href", "/catalog");
  });

  test("Cart button product count is displayed correctly", () => {
    const testProduct: CartProduct = new CartProduct(1, 1);

    useCartStore.setState({ cartProductList: [testProduct] });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("cart-product-counter")).toHaveTextContent("1");
  });

  test("Loading circle is displayed when loading auth", () => {
    useAuthStore.setState({ loadingAuth: true });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("loading-circle"));
  });

  test("Login button is displayed when not logged in", () => {
    useAuthStore.setState({ loadingAuth: false, signedIn: false });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    expect(screen.getByRole("link", { name: "Вход" }));
  });

  test("User logo button is displayed when logged in", () => {
    useAuthStore.setState({ loadingAuth: false, signedIn: true });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("userlogo-button"));
  });

  test("Account menu is working correctly", async () => {
    useAuthStore.setState({ loadingAuth: false, signedIn: true });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    const accountButton = screen.getByTestId("userlogo-button");

    await userEvent.hover(accountButton);
    await userEvent.click(accountButton);
    expect(screen.getByText("Выйти"));
    expect(screen.queryByText("Админ панель")).not.toBeInTheDocument();

    await userEvent.pointer({ keys: "[MouseLeft]", coords: { x: 0, y: 0 } });
    expect(screen.queryByText("Выйти")).not.toBeInTheDocument();
  });

  test("Account menu contains 'Admin Panel' button if the user is admin", async () => {
    useAuthStore.setState({ loadingAuth: false, signedIn: true, isAdmin: true });

    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    const accountButton = screen.getByTestId("userlogo-button");

    await userEvent.hover(accountButton);
    await userEvent.click(accountButton);
    expect(screen.getByText("Админ панель"));
  });
});
