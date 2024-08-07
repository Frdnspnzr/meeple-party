import { expect, test } from "@playwright/test";
import { Role, User } from "@prisma/client";
import { logInAsNewUser } from "./utility";

test.describe("Logged out user", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test("visual test", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Login or Register" })
    ).toBeVisible();
    await expect(page).toHaveScreenshot();
  });
  test("has login button", async ({ page }) => {
    await expect(
      page.getByRole("button", { name: "Login or Register" })
    ).toBeVisible();
  });
  test("login button navigates to login screen", async ({ page }) => {
    await page.getByRole("button", { name: "Login or Register" }).click();
    await expect(
      page.getByRole("heading", { name: "Log in to Meeple Party" })
    ).toBeVisible();
  });
});

let user: User | undefined;

test.describe("Logged in user", () => {
  test.beforeEach(async ({ page }) => {
    user = await logInAsNewUser(page.context(), Role.ADMIN);
    await page.goto("/");
  });
  test("has expected ui", async ({ page }) => {
    await expect(page.getByRole("button", { name: "Logout " })).toBeVisible();
    await expect(page.getByRole("link", { name: "Go to app " })).toBeVisible();
    await expect(page.getByText(user?.realName || "fail")).toBeVisible();
    await expect(page.getByText(user?.name || "fail")).toBeVisible();
    await expect(
      page.getByText(user?.name?.charAt(0) || "#", { exact: true })
    ).toBeVisible();
  });
  test("button navigates to app", async ({ page }) => {
    await page.getByRole("link", { name: "Go to app " }).click();
    await page.waitForURL("/app");
  });
  test("button logs out", async ({ page }) => {
    await page.getByRole("button", { name: "Logout " }).click();
    await expect(
      page.getByRole("button", { name: "Login or Register" })
    ).toBeVisible();
  });
});
