import { test, expect } from "@playwright/test";
import { seed } from "@repo/db/seed";

test.describe("Admin Pagination", () => {
    test.beforeAll(async () => {
        await seed();
    });

    test.beforeEach(async ({ page }) => {
         await page.goto("http://localhost:3002/");
         // Login if needed
         if (page.url().includes("/sign-in")) {
            await page.fill('input[name="password"]', "123");
            await page.click('button[type="submit"]');
            await page.waitForURL("http://localhost:3002/");
         }
    });

  test("should navigate through pages in admin", async ({ page }) => {
    // 1. Visit the home page (dashboard/posts list)
    await page.goto("http://localhost:3002/?page=1&limit=5");

    // Check Page 1 (Limit 5)
    // order by date desc
    await expect(page.getByText("Boost your conversion rate")).toBeVisible();
    await expect(page.getByText("Database scaling made easy")).toBeVisible();
    
    // Post 6 "Visual Basic is the future" should NOT be on page 1
    await expect(page.getByText("Visual Basic is the future")).not.toBeVisible();

    // Navigate to Page 2
    const nextButton = page.getByLabel("Go to next page");
    await nextButton.click();

    // Verify URL and Page 2
    await expect(page).toHaveURL(/page=2/);
    
    // Should show "Visual Basic is the future" (Post 6)
    await expect(page.getByText("Visual Basic is the future")).toBeVisible();
    // Should show "Generated Post 7"
    await expect(page.getByText("Generated Post 20")).toBeVisible();
    
    // Post 1 should not be visible
    await expect(page.getByText("Boost your conversion rate")).not.toBeVisible();
  });
});
