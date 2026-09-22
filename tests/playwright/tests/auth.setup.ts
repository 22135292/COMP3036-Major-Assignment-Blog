import { expect, test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";

const authFile = path.resolve(".auth/user.json");

setup("authenticate admin", async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), {
    recursive: true,
  });

  await page.goto("http://127.0.0.1:3002/sign-in");

  await expect(
    page.getByRole("heading", {
      name: "Welcome back.",
    }),
  ).toBeVisible();

  await page
    .getByLabel("Password", {
      exact: true,
    })
    .fill(process.env.PASSWORD ?? "123");

  await page
    .getByRole("button", {
      name: /sign in/i,
    })
    .click();

  await expect(page).toHaveURL("http://127.0.0.1:3002/");

  await page.context().storageState({
    path: authFile,
  });

  expect(fs.existsSync(authFile)).toBeTruthy();
});