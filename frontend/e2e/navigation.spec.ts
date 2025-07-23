import { test, expect } from "@playwright/test";

test.describe("Website Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/");
  });

  test("has main page link", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Главная" })).toBeVisible();
  });

  test("catalog page link works correctly", async ({ page }) => {
    await page.getByRole("link", { name: "Каталог" }).click();

    await expect(page).toHaveURL(/.*catalog/);
  });

  test("cart page link works correctly", async ({ page }) => {
    await page.getByTestId("cart-link").click();

    await expect(page).toHaveURL(/.*cart/);
  });
});
