import { expect, test } from "@playwright/test";
import { seed } from "@repo/db/seed";

test.describe("Nested comment system", () => {
  test.beforeAll(async () => {
    await seed();
  });

  test("creates a comment and a nested reply", async ({ page }) => {
    await page.goto("http://localhost:3001/post/boost-your-conversion-rate");

    await page.getByLabel("Name").fill("Honghui");
    await page.getByLabel("Comment").fill("This article is very useful.");
    await page.getByRole("button", { name: "Post comment" }).click();
    await expect(page.getByText("This article is very useful.")).toBeVisible();

    await page.getByRole("button", { name: "Reply" }).first().click();
    await expect(page.getByText("Replying to Honghui")).toBeVisible();
    await page.getByLabel("Name").fill("Bonnie");
    await page.getByLabel("Comment").fill("Thanks for sharing your thoughts!");
    await page.getByRole("button", { name: "Post reply" }).click();
    await expect(page.getByText("Thanks for sharing your thoughts!")).toBeVisible();
  });
});
