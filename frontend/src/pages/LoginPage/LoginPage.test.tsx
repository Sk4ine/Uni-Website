import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { LoginPage } from "./LoginPage";
import { useAuthStore } from "../../stores/authStore";
import userEvent from "@testing-library/user-event";
import type { Mock } from "vitest";
import { handleLogin } from "../../api/requests/user";

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router")>("react-router");
  return {
    ...actual,
    Navigate: vi.fn(({ to, replace }) => (
      <div data-testid="mock-navigate" data-to={to} data-replace={replace ? "true" : "false"}>
        Mock Navigate to {to}
      </div>
    )),
  };
});

vi.mock("../../api/requests/user", async () => {
  const actual = await vi.importActual("../../api/requests/user");
  return {
    ...actual,
    handleLogin: vi.fn(),
  };
});

describe("Login Page", () => {
  const testEmail: string = "test@email.com";
  const testPassword: string = "1234";
  const testJWT: string = "test-jwt-token";

  beforeEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState());
    useAuthStore.setState({ loadingAuth: false, signIn: vi.fn() });
  });

  test("LoginPage is rendered correctly", () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const homePageButton = screen.getByRole("link", { name: "Создать" });
    expect(homePageButton).toHaveAttribute("href", "/auth/registration");
  });

  test("Loading message is displayed while loading auth", () => {
    useAuthStore.setState({ loadingAuth: true });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    expect(screen.getByText("Загрузка данных пользователя..."));
  });

  test("Navigates to user profile is already logged in", () => {
    useAuthStore.setState({ signedIn: true });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const mockNavigate = screen.getByTestId("mock-navigate");
    expect(mockNavigate).toHaveAttribute("data-to", "/user-profile");
    expect(mockNavigate).toHaveAttribute("data-replace", "true");
  });

  test("Successful login", async () => {
    (handleLogin as Mock).mockResolvedValue(testJWT);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Пароль");

    await userEvent.type(emailField, testEmail);
    await userEvent.type(passwordField, testPassword);
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(handleLogin).toBeCalledWith(testEmail, testPassword);
    expect(useAuthStore.getState().signIn).toBeCalledWith(testJWT);
  });

  test("Failed login due to incorrect credentials", async () => {
    (handleLogin as Mock).mockRejectedValue(
      Object.assign(new Error(""), {
        isAxiosError: true,
        response: { status: 401, data: {} },
      }),
    );

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>,
    );

    const emailField = screen.getByLabelText("Email");
    const passwordField = screen.getByLabelText("Пароль");

    await userEvent.type(emailField, testEmail);
    await userEvent.type(passwordField, testPassword);
    await userEvent.click(screen.getByRole("button", { name: "Войти" }));

    expect(handleLogin).toBeCalledWith(testEmail, testPassword);
    expect(screen.getByText("Неверный email или пароль"));
  });
});
