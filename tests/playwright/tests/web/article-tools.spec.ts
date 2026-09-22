import {
  expect,
  test,
} from "@playwright/test";

test.beforeEach(
  async ({ context, page }) => {
    await context.grantPermissions([
      "clipboard-read",
      "clipboard-write",
    ]);

    await page.goto(
      "/post/boost-your-conversion-rate",
    );

    await expect(
      page.getByTestId(
        "content-markdown",
      ),
    ).toBeVisible();
  },
);

test(
  "shows reading time and updates the reading progress",
  async ({ page }) => {
    await expect(
      page.getByTestId("reading-time"),
    ).toContainText(
      /\d+ min read/,
    );

    await page.evaluate(() => {
      window.scrollTo(
        0,
        document.documentElement.scrollHeight,
      );
    });

    await expect(
      page.getByTestId(
        "reading-progress",
      ),
    ).toHaveAttribute(
      "style",
      /width: 100%/,
    );
  },
);

test(
  "copies the current article URL",
  async ({ page }) => {
    await page
      .getByRole("button", {
        name: "Copy link",
      })
      .click();

    await expect(
      page.getByRole("button", {
        name: "Link copied",
      }),
    ).toBeVisible();

    const clipboardText =
      await page.evaluate(() =>
        navigator.clipboard.readText(),
      );

    expect(clipboardText).toBe(
      page.url(),
    );
  },
);