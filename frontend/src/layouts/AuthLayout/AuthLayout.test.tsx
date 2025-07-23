import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router";
import { AuthLayout } from "./AuthLayout";

describe("Auth Layout", () => {
  test("Auth navigation bar is rendered correctly", () => {
    render(
      <BrowserRouter>
        <AuthLayout />
      </BrowserRouter>,
    );

    expect(screen.getByTestId("home-button"));
  });
});
