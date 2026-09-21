import { test, expect } from "@playwright/test";
import { seed } from "@repo/db/seed";

test.describe("Web Pagination", () => {
  test.beforeAll(async () => {
      await seed();
  });

  test("should navigate through pages", async ({ page }) => {
    // 1. Visit the home page
    await page.goto("http://localhost:3001/?page=1&limit=5");

    
    // Check Page 1 content
    await expect(page.getByText("Boost your conversion rate")).toBeVisible();
    await expect(page.getByText("Database scaling made easy")).toBeVisible();
    
    // Post 6 "Visual Basic is the future" should NOT be on page 1 (limit 5)
    await expect(page.getByText("Generated Post 20")).not.toBeVisible();

    // Find Next button and click
    const nextButton = page.getByLabel("Go to next page");
    await nextButton.click();

    // Verify URL
    await expect(page).toHaveURL(/page=2/);

    // Verify Page 2 content
    await expect(page.getByText("Generated Post 20")).toBeVisible();
    
    // Post 1 should not be visible
    await expect(page.getByText("Boost your conversion rate")).not.toBeVisible();
  });
});
