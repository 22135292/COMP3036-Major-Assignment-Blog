import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

////////////////////////////////////////
// Authentication for Assignment 2
// Delete the code block below if you are not using it
////////////////////////////////////////

setup(
  "authenticate assignment 2",
  { tag: "@a2" },
  async ({ page, playwright }) => {
    const authFile = path.join(
      process.cwd(),
      "tests/playwright/.auth/user.json",
    );

    // đảm bảo folder tồn tại
    fs.mkdirSync(path.dirname(authFile), { recursive: true });
    // const content = {
    //   cookies: [
    //     {
    //       name: "password",
    //       value: "123",
    //       domain: "localhost",
    //       secure: false,
    //       expires: -1,
    //       path: "/",
    //       httpOnly: false,
    //       sameSite: "Lax",
    //     },
    //   ],
    // };

    await page.goto("/");
    await page.getByLabel("Password", { exact: true }).fill("123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("/");
    await page.context().storageState({ path: authFile });

    expect(fs.existsSync(authFile)).toBeTruthy();
    // fs.writeFileSync(authFile, JSON.stringify(content, null, 2));
  },
);

////////////////////////////////////////////////////////
// Authentication for Assignment 3
// Uncomment once you start working on the assignment 3
////////////////////////////////////////////////////////

setup("authenticate assignment 3", { tag: "@a3" }, async ({ playwright }) => {
  const authFile = ".auth/user.json";

  const apiContext = await playwright.request.newContext();

  await apiContext.post("/api/auth", {
    data: JSON.stringify({ password: "123" }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await apiContext.storageState({ path: authFile });
});
