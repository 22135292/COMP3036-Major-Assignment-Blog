
import { test, expect } from '@playwright/test';

  test('should create a new post using the Tiptap editor', async ({ page }) => {
    // 1. Visit the home page
    await page.goto('/');

    // Login if redirected to sign-in
    if (page.url().includes("/sign-in")) {
        await page.fill('input[name="password"]', "123");
        await page.click('button[type="submit"]');
        await page.waitForURL("http://localhost:3002/");
    }

    // 2. Navigate to Create Post
    await page.goto('/posts/create');

    // Wait for form to load
    await expect(page.locator('form#post-form')).toBeVisible();

    // 3. Fill form details
    const timestamp = Date.now();
    await page.getByLabel('Title').fill(`E2E Rich Text Post ${timestamp}`);
    await page.getByLabel('Category').fill('Testing');
    await page.getByLabel('Description').fill('This is a test post description.');
    await page.getByLabel('Image URL').fill('https://example.com/image.jpg');
    await page.getByLabel('Tags').fill('e2e, testing');

    // 4. Switch to Rich Text mode
    await page.getByRole('button', { name: "Rich Text" }).click();
    
    // 5. Interact with Tiptap Editor
    const editor = page.locator('.ProseMirror');
    await expect(editor).toBeVisible();
    await editor.click();
    await editor.clear();
    await editor.pressSequentially('Hello Tiptap World! This is bold and italic.', { delay: 50 });

    // Test specific Tiptap interactions if needed (e.g. bolding)
    // Select "bold" text
    await editor.dblclick(); // select last word
    await page.getByRole('button', { name: "Bold" }).click();

    // 6. Submit form
    await page.getByRole('button', { name: "Save" }).click();

    // 7. Verify redirection/success
    await expect(page.getByText('Post created successfully')).toBeVisible();
    // Verify we are redirected to the post detail page
    await expect(page).toHaveURL(/\/post\/.+/);
  });


