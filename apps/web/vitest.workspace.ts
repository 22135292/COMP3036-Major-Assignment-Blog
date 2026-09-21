import react from "@vitejs/plugin-react";
import path from "path";

import { defineWorkspace } from "vitest/config";

const srcDir = path.resolve(__dirname, "src");

export default defineWorkspace([
  {
    test: {
      // an example of file based convention,
      // you don't have to follow it
      include: ["./src/**/*.{test,spec}.ts"],
      name: "unit",
      environment: "node",
    },
  },
  {
    define: {
      "process.env": {},
    },
    resolve: {
      alias: [
        { find: /^@\//, replacement: `${srcDir}/` },
        {
          find: "@repo/utils/url",
          replacement: path.resolve(__dirname, "../../packages/utils/src/url.ts"),
        },
        {
          find: "next/link",
          replacement: path.resolve(__dirname, "src/mocks/link"),
        },
        {
          find: "next/image",
          replacement: path.resolve(__dirname, "src/mocks/image"),
        },
      ],
    },
    plugins: [react()],
    optimizeDeps: {
      include: [
        "vitest-browser-react",
        "lucide-react",
        "class-variance-authority",
        "@radix-ui/react-aspect-ratio",
        "clsx",
        "tailwind-merge",
      ],
    },
    test: {
      // an example of file based convention,
      // you don't have to follow it
      include: ["./src/**/*.{test,spec}.tsx"],
      setupFiles: "./vitest.setup.tsx",
      name: "browser",
      browser: {
        enabled: true,
        provider: "playwright",
        instances: [{ browser: "chromium" }],
      },
    },
  },
]);
