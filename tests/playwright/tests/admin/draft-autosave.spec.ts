import {
  expect,
  test,
  type Page,
} from "@playwright/test";

async function signIn(page: Page) {
  await page.goto("/posts/create");

  if (page.url().includes("/sign-in")) {
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

    await page.waitForURL(
      "http://localhost:3002/",
      {
        timeout: 15_000,
      },
    );

    await page.goto("/posts/create");
  }

  await expect(page).toHaveURL(
    /\/posts\/create$/,
  );

  await expect(
    page.getByRole("heading", {
      name: "Create Post",
      exact: true,
    }),
  ).toBeVisible();
}

test(
  "automatically saves and restores an unfinished post",
  async ({ page }) => {
    await signIn(page);

    await page.evaluate(() => {
      localStorage.clear();
    });

    await page.reload();

    await page
      .getByLabel("Title")
      .fill("My locally saved draft");

    await page
      .getByLabel("Description")
      .fill(
        "This content should survive a browser refresh.",
      );

    await expect(
      page.getByTestId("draft-status"),
    ).toContainText(
      "Draft saved locally",
    );

    await page.reload();

    await expect(
      page.getByTestId("draft-recovery"),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: "Restore draft",
      })
      .click();

    await expect(
      page.getByLabel("Title"),
    ).toHaveValue(
      "My locally saved draft",
    );

    await expect(
      page.getByLabel("Description"),
    ).toHaveValue(
      "This content should survive a browser refresh.",
    );
  },
);