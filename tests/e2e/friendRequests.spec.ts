import { expect, test } from "@playwright/test";
import {
  befriendUser,
  createUser,
  logInAsNewUser,
  sendFriendRequest,
} from "./utility";

test.describe("Friend requests on profile page", () => {
  test("can send friend request", async ({ page }) => {
    await logInAsNewUser(page.context());
    const otherUser = await createUser();

    page.goto(`/app/profile/${otherUser.id}`);
    await page.getByRole("button", { name: "Send friend request" }).click();
    await expect(
      page.getByRole("button", { name: "Withdraw your friend request" })
    ).toBeVisible();
  });
  test("can withdraw friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(myself.id, otherUser.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page
      .getByRole("button", { name: "Withdraw your friend request" })
      .click();
    await expect(
      page.getByRole("button", { name: "Send friend request" })
    ).toBeVisible();
  });
  test("can end friendships", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await befriendUser(myself.id, otherUser.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page.getByRole("button", { name: "End friendship" }).click();
    await expect(
      page.getByRole("button", { name: "Send friend request" })
    ).toBeVisible();
  });
  test("can accept friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(otherUser.id, myself.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page.getByRole("button", { name: "Accept" }).click();
    await expect(
      page.getByRole("button", { name: "End friendship" })
    ).toBeVisible();
  });
  test("can deny friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(otherUser.id, myself.id);

    page.goto(`/app/profile/${otherUser.id}`);
    await page.getByRole("button", { name: "Deny" }).click();
    await expect(
      page.getByRole("button", { name: "Send friend request" })
    ).toBeVisible();
  });
  test.describe("changes immediately visible in friend request overview", () => {
    test("sent request", async ({ page }) => {
      await logInAsNewUser(page.context());
      const otherUser = await createUser();

      page.goto(`/app/profile/${otherUser.id}`);
      await page.getByRole("button", { name: "Send friend request" }).click();

      page.goto("/app/friends/requests");
      await expect(page.getByText(otherUser.name || "")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Withdraw your friend request" })
      ).toBeVisible();
    });
    test("withdrawn friend request", async ({ page }) => {
      const myself = await logInAsNewUser(page.context());
      const otherUser = await createUser();

      await sendFriendRequest(myself.id, otherUser.id);

      page.goto("/app/friends/requests");
      await expect(page.getByText(otherUser.name || "")).not.toBeVisible();
    });
    test("accepted friend request", async ({ page }) => {
      const myself = await logInAsNewUser(page.context());
      const otherUser = await createUser();

      await sendFriendRequest(otherUser.id, myself.id);

      page.goto(`/app/profile/${otherUser.id}`);
      await page.getByRole("button", { name: "Accept" }).click();

      page.goto("/app/friends/requests");
      await expect(page.getByText(otherUser.name || "")).not.toBeVisible();
    });
  });
});

test.describe("Friend requests on overview page", () => {
  test("can withdraw friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(myself.id, otherUser.id);

    page.goto("/app/friends/requests");
    await page
      .getByRole("button", { name: "Withdraw your friend request" })
      .click();
    await expect(page.getByText(otherUser.name || "")).not.toBeVisible();
  });
  test("can accept friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(otherUser.id, myself.id);

    page.goto("/app/friends/requests");
    await page.getByRole("button", { name: "Accept" }).click();
    await expect(page.getByText(otherUser.name || "")).not.toBeVisible();
  });
  test("can deny friend request", async ({ page }) => {
    const myself = await logInAsNewUser(page.context());
    const otherUser = await createUser();

    await sendFriendRequest(otherUser.id, myself.id);

    page.goto("/app/friends/requests");
    await page.getByRole("button", { name: "Deny" }).click();
    await expect(page.getByText(otherUser.name || "")).not.toBeVisible();
  });

  test.describe("changes immediately visible on profile page", () => {
    test("withdrawn friend request", async ({ page }) => {
      const myself = await logInAsNewUser(page.context());
      const otherUser = await createUser();

      await sendFriendRequest(myself.id, otherUser.id);

      page.goto("/app/friends/requests");
      await page
        .getByRole("button", { name: "Withdraw your friend request" })
        .click();

      page.goto(`/app/profile/${otherUser.id}`);
      await expect(
        page.getByRole("button", { name: "Send friend request" })
      ).toBeVisible();
    });
    test("accepted friend request", async ({ page }) => {
      const myself = await logInAsNewUser(page.context());
      const otherUser = await createUser();

      await sendFriendRequest(otherUser.id, myself.id);

      page.goto("/app/friends/requests");
      await page.getByRole("button", { name: "Accept" }).click();

      page.goto(`/app/profile/${otherUser.id}`);
      await expect(
        page.getByRole("button", { name: "End friendship" })
      ).toBeVisible();
    });
  });
});
