import { expect, test } from "@playwright/test";
import { User } from "@prisma/client";
import { AVAILABLE_GAMES } from "./globalSetup";
import {
  addGamesToCollection,
  clearCollection,
  deleteUser,
  logInAsNewUser,
} from "./utility";

let user: User | undefined;

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    user = await logInAsNewUser(page.context());
    await clearCollection(user.id);
    await addGamesToCollection(user.id, AVAILABLE_GAMES);
  });
  test.afterEach(async () => {
    if (user) {
      deleteUser(user.id);
    }
  });
  test("has expected pages with small gamebox", async ({ page }) => {
    await page.goto("/app/collection");
    await page.getByRole("radiogroup").locator("label").first().click();
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "3" })).toBeVisible();
    await expect(page.getByRole("button", { name: "4" })).toBeVisible();
    await expect(page.getByLabel("Current page")).toHaveValue("1");
    await expect(page.getByText("of 4")).toBeVisible();
    await expect(page.getByRole("button", { name: "1" })).toHaveClass(/active/);
  });
  test("has expected pages with big gamebox", async ({ page }) => {
    await page.goto("/app/collection");
    await page.getByRole("radiogroup").locator("label").nth(1).click();
    await expect(page.getByRole("button", { name: "1" })).toBeVisible();
    await expect(page.getByRole("button", { name: "2" })).toBeVisible();
    await expect(page.getByRole("button", { name: "3" })).toBeVisible();
    await expect(page.getByRole("button", { name: "6" })).toBeVisible();
    await expect(page.getByText("…6")).toBeVisible();
    await expect(page.getByLabel("Current page")).toHaveValue("1");
    await expect(page.getByText("of 6")).toBeVisible();
    await expect(page.getByRole("button", { name: "1" })).toHaveClass(/active/);
  });
  test("button display changes with changing pages", async ({ page }) => {
    await page.goto("/app/collection");
    await page.getByRole("radiogroup").locator("label").nth(1).click();
    await page.getByRole("button", { name: "3" }).click();
    await expect(page.getByRole("button", { name: "3" })).toHaveClass(/active/);
    await expect(page.getByRole("button", { name: "4" })).toBeVisible();
    await expect(page.getByRole("button", { name: "5" })).toBeVisible();
    await expect(page.getByLabel("Current page")).toHaveValue("3");
  });
  test("button changes pages", async ({ page }) => {
    await page.goto("/app/collection");
    await expect(
      page.getByRole("heading", { name: "7 Wonders Duel" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ark Nova" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Brass: Lancashire" })
    ).toBeVisible();
    await page.getByRole("button", { name: "3" }).click();
    await expect(
      page.getByRole("heading", { name: "Frosthaven" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Lost Ruins of Arnak" })
    ).toBeVisible();
    await page.getByRole("button", { name: "6" }).click();
    await expect(
      page.getByRole("heading", { name: "The Crew: Mission Deep Sea" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Wingspan" })).toBeVisible();
  });
  test("inputting pages changes current page",async ({page}) => {
    await page.goto("/app/collection");
    await page.getByLabel('Current page')
  })
});
