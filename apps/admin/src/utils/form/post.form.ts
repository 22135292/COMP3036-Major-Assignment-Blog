import * as z from "zod";

export const PostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description is too long. Maximum is 200 characters"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z
    .string()
    .min(1, "Image URL is required")
    .url("This is not a valid URL"),
  tags: z.string().min(1, "At least one tag is required"),
  category: z.string().optional(),
});

export type PostSchemaType = z.infer<typeof PostSchema>;
