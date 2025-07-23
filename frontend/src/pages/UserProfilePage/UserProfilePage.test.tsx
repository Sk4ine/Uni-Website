import { BrowserRouter, Navigate } from "react-router";
import { UserProfilePage } from "./UserProfilePage";
import { act, render, screen } from "@testing-library/react";
import { getProductList } from "../../api/requests/products";
import type { Mock } from "vitest";
import { Product } from "../../classes/product";
import { getUserInfo, getUserOrders } from "../../api/requests/user";
import { Order } from "../../classes/order";
import { useAuthStore } from "../../stores/authStore";
import { User } from "../../classes/user";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    Navigate: vi.fn(({ to, replace }) => (
      <div data-testid="mock-navigate" data-to={to} data-replace={replace ? "true" : "false"}>
        Mock Navigate to {to}
      </div>
    )),
  };
});

vi.mock("../../api/requests/products", () => ({
  getProductList: vi.fn(),
}));

vi.mock("../../api/requests/user", () => ({
  getUserOrders: vi.fn(),
  getUserInfo: vi.fn(),
}));

describe("UserProfile Page", () => {
  const testProduct1: Product = new Product(
    1,
    1,
    "testProduct",
    299,
    ["material"],
    5,
    4,
    "Unknown",
  );
  const testOrder1: Order = new Order(1, 1, 299, "Processing");
  const testUser: User = new User("test@email.com", "Test", "User", "89998887755");

  beforeEach(() => {
    useAuthStore.setState({ loadingAuth: false, signedIn: true });
    vi.clearAllMocks();
  });

  test("useEffect API calls are made successfuly", async () => {
    (getProductList as Mock).mockResolvedValue([testProduct1]);
    (getUserOrders as Mock).mockResolvedValue([testOrder1]);
    (getUserInfo as Mock).mockResolvedValue(testUser);

    await act(async () => {
      render(
        <BrowserRouter>
          <UserProfilePage />
        </BrowserRouter>,
      );
    });

    expect(getProductList).toBeCalledTimes(1);
    expect(getUserOrders).toBeCalledTimes(1);
  });

  test("useEffect code is not ran if loading auth or user is not signed in", async () => {
    useAuthStore.setState({ loadingAuth: true });

    await act(async () => {
      render(
        <BrowserRouter>
          <UserProfilePage />
        </BrowserRouter>,
      );
    });

    expect(getProductList).toBeCalledTimes(0);
  });

  test("Navigates to home page if user is not signed in", async () => {
    useAuthStore.setState({ signedIn: false });

    await act(async () => {
      render(
        <BrowserRouter>
          <UserProfilePage />
        </BrowserRouter>,
      );
    });

    const mockNavigate = screen.getByTestId("mock-navigate");
    expect(Navigate).toBeCalledTimes(1);
    expect(mockNavigate).toHaveAttribute("data-to", "/home");
    expect(mockNavigate).toHaveAttribute("data-replace", "true");
  });
});
