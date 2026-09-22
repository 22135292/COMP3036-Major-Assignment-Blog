import {
  expect,
  test,
  type Page,
} from "@playwright/test";
import path from "node:path";

const uploadFixture = path.resolve(
  process.cwd(),
  "upload-test.png",
);

async function openCreatePost(page: Page) {
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
  ).toBeVisible({
    timeout: 15_000,
  });
}

async function fillRequiredPostFields(
  page: Page,
  title: string,
) {
  await page
    .getByLabel("Title")
    .fill(title);

  await page
    .getByLabel("Category")
    .fill("Testing");

  await page
    .getByLabel("Description")
    .fill(
      "An article created by the Playwright E2E image test.",
    );

  await page
    .getByTestId("content")
    .fill(
      "# Image E2E test\n\nThe image should be visible.",
    );

  await page
    .getByLabel("Tags")
    .fill("e2e, image");
}

test.describe(
  "Admin post cover images",
  () => {
    test(
      "creates a post using a pasted external image URL",
      async ({ page }) => {
        const uniqueId = Date.now();
        const title =
          `External image E2E ${uniqueId}`;

        const imageUrl =
          "https://www.equinetmedia.com/hubfs/How-to-find-b2b-blog-images.png";

        await openCreatePost(page);
        await fillRequiredPostFields(
          page,
          title,
        );

        await page
          .getByTestId("image-url")
          .fill(imageUrl);

        await expect(
          page.getByTestId("image-preview"),
        ).toHaveAttribute(
          "src",
          imageUrl,
        );

        await page
          . await page
          .getByRole("button", {
            name: "Save",
          })
          .click();

        await expect(
          page.getByText(
            "Post created successfully",
          ),
        ).toBeVisible();

        await expect(page).toHaveURL(
          /\/post\/external-image-e2e-/,
        );

        const postPath = new URL(
          page.url(),
        ).pathname;

        await expect(
          page
            .locator(
              `img[src="${imageUrl}"]`,
            )
            .first(),
        ).toBeVisible();

        await page.goto(
          `http://localhost:3001${postPath}`,
        );

        await expect(
          page.getByRole("heading", {
            name: title,
          }),
        ).toBeVisible();

        await expect(
          page
            .locator(
              `img[src="${imageUrl}"]`,
            )
            .first(),
        ).toBeVisible();
      },
    );

    test(
      "uploads a computer image and stores the returned Cloudinary URL",
      async ({ page }) => {
        const uniqueId = Date.now();
        const title =
          `Computer upload E2E ${uniqueId}`;

        const uploadedUrl =
          "https://res.cloudinary.com/e2e-test/image/upload/blog/computer-upload.png";

        // Keep CI deterministic and independent from a real Cloudinary account.
        await page.route(
          "https://api.cloudinary.com/**",
          async (route) => {
            await route.fulfill({
              status: 200,
              contentType:
                "application/json",
              body: JSON.stringify({
                secure_url: uploadedUrl,
              }),
            });
          },
        );

        await openCreatePost(page);
        await fillRequiredPostFields(
          page,
          title,
        );

        await page
          .locator('input[type="file"]')
          .setInputFiles(
            uploadFixture,
          );

        await expect(
          page.getByText(
            "Image uploaded successfully",
          ),
        ).toBeVisible();

        await expect(
          page.getByTestId("image-url"),
        ).toHaveValue(uploadedUrl);

        await expect(
          page.getByTestId("image-preview"),
        ).toHaveAttribute(
          "src",
          uploadedUrl,
        );

        await page
          .getByRole("button", {
            name: "Save",
          })
          .click();

        await expect(
          page.getByText(
            "Post created successfully",
          ),
        ).toBeVisible();

        await expect(page).toHaveURL(
          /\/post\/computer-upload-e2e-/,
        );

        await expect(
          page
            .locator(
              `img[src="${uploadedUrl}"]`,
            )
            .first(),
        ).toBeVisible();
      },
    );

    test(
      "rejects a file larger than 10 MB",
      async ({ page }) => {
        await openCreatePost(page);

        await page
          .locator('input[type="file"]')
          .setInputFiles({
            name: "too-large.png",
            mimeType: "image/png",
            buffer: Buffer.alloc(
              10 * 1024 * 1024 + 1,
            ),
          });

        await expect(
          page.getByText(
            "The image must be smaller than 10 MB",
          ),
        ).toBeVisible();

        await expect(
          page.getByTestId("image-url"),
        ).toHaveValue("");
      },
    );
  },
);