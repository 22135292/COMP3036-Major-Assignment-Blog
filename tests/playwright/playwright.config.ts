import { defineConfig, devices } from "@playwright/test";
import "dotenv/config";
import fs from "fs";
import path from "path";

const authDir = path.resolve(".auth");

fs.mkdirSync(authDir, {
  recursive: true,
});

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,

  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],
  ],

  use: {
    baseURL: "http://127.0.0.1:3002",
    trace: "retain-on-failure",
    testIdAttribute: "data-test-id",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "setup",
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: "chromium",
      testDir: "./tests/admin",
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:3002",
        storageState: ".auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "chromium-web-home",
      testDir: "./tests/web",
      testMatch: /home-screen\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:3001",
      },
    },
    {
      name: "chromium-web",
      testDir: "./tests/web",
      testIgnore: /home-screen\.spec\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: "http://127.0.0.1:3001",
      },
      dependencies: ["chromium-web-home"],
    },
    {
      name: "mobile-chrome",
      testDir: "./tests/web",
      use: {
        ...devices["Pixel 5"],
        baseURL: "http://127.0.0.1:3001",
      },
    },
    {
      name: "mobile-safari",
      testDir: "./tests/web",
      use: {
        ...devices["iPhone 13"],
        baseURL: "http://127.0.0.1:3001",
      },
    },
  ],

  webServer: process.env.CI
    ? [
        {
          command: "pnpm start:admin",
          url: "http://127.0.0.1:3002",
          reuseExistingServer: false,
          timeout: 120_000,
        },
        {
          command: "pnpm start:web",
          url: "http://127.0.0.1:3001",
          reuseExistingServer: false,
          timeout: 120_000,
        },
      ]
    : undefined,
});