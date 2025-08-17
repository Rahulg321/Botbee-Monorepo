import { z } from "zod";

export const createPromptSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  content: z
    .string()
    .min(1, "Content is required")
    .max(10000, "Content must be less than 10000 characters"),
  categoryId: z
    .string()
    .uuid("Category ID must be a valid UUID")
    .min(1, "Category is required"),
  status: z.enum(["draft", "published", "archived"]),
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;

export const createPromptCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type CreatePromptCategoryInput = z.infer<
  typeof createPromptCategorySchema
>;
