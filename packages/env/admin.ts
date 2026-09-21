import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    PASSWORD: z.string(),
    JWT_SECRET: z.string(),

    DATABASE_URL: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
  },

  client: {},

  runtimeEnv: {
    PASSWORD: process.env.PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,

    DATABASE_URL: process.env.DATABASE_URL,
    CLOUDINARY_CLOUD_NAME:
      process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:
      process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:
      process.env.CLOUDINARY_API_SECRET,
  },

  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION,

  emptyStringAsUndefined: true,
});
