import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeAll(async () => {
  await seed();
});

test.describe("ADMIN HOME SCREEN", () => {
  test(
    "Shows login screen",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");

      await expect(
        page.getByRole("button", {
          name: /sign in/i,
        }),
      ).toBeVisible();

      await expect(
        page.getByRole("heading", {
          name: "Welcome back.",
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        page.getByLabel("Password", {
          exact: true,
        }),
      ).toBeVisible();
    },
  );

  test(
    "Can login",
    {
      tag: "@a2",
    },
    async ({ page }) => {
      await page.goto("/");

      await page
        .getByLabel("Password", {
          exact: true,
        })
        .fill("123");

      await page
        .getByRole("button", {
          name: /sign in/i,
        })
        .click();

      await page.waitForURL("/", {
        timeout: 15_000,
      });

      await expect(
        page.getByText("Full Stack Blog", {
          exact: true,
        }),
      ).toBeVisible();

      const cookies =
        await page.context().cookies();

      const authCookie = cookies.find(
        (cookie) =>
          cookie.name === "auth_token",
      );

      expect(authCookie).toBeDefined();

      await expect(
        page.getByRole("button", {
          name: "Logout",
          exact: true,
        }),
      ).toBeVisible();

      await page
        .getByRole("button", {
          name: "Logout",
          exact: true,
        })
        .click();

      await page.waitForURL(
        /\/sign-in$/,
        {
          timeout: 15_000,
        },
      );

      await expect(
        page.getByRole("heading", {
          name: "Welcome back.",
          exact: true,
        }),
      ).toBeVisible();

      await expect(
        page.locator("article"),
      ).toHaveCount(0);
    },
  );

  test(
    "Shows home screen to authorised user",
    {
      tag: "@a2",
    },
    async ({ userPage }) => {
      await userPage.goto(
        "/?page=1&limit=6",
      );

      await expect(
        userPage.getByText(
          "Full Stack Blog",
          {
            exact: true,
          },
        ),
      ).toBeVisible();

      await expect(
        userPage.locator("article"),
      ).toHaveCount(6);
    },
  );
});