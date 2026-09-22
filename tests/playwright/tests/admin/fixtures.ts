import "dotenv/config";

import {
  test as base,
  type BrowserContext,
  type Page,
} from "@playwright/test";

export const e2epassword = "123";

export async function seedData(...options: unknown[]) {
  return options;
}

type MyFixtures = {
  userPage: Page;
};

type AppOptions = Record<string, never>;

export function createOptions(
  options: Partial<AppOptions>,
) {
  return JSON.stringify(options);
}

export async function setOptions(
  context: BrowserContext,
  options: Partial<AppOptions>,
) {
  const applicationUrl =
    process.env.VERCEL_URL ??
    "http://localhost:3002";

  await context.addCookies([
    {
      name: "options",
      url: applicationUrl,
      value: createOptions(options),
    },
  ]);
}

export * from "@playwright/test";

export const test = base.extend<MyFixtures>({
  userPage: async ({ browser }, use) => {
    const context = await browser.newContext();
    const userPage = await context.newPage();

    await userPage.goto(
      "http://localhost:3002/sign-in",
    );

    await userPage
      .getByLabel("Password", { exact: true })
      .fill(e2epassword);

    await userPage
      .getByRole("button", { name: /sign in/i })
      .click();

    await userPage.waitForURL(
      "http://localhost:3002/",
      {
        timeout: 15_000,
      },
    );

    await use(userPage);
    await context.close();
  },
});