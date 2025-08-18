import { z } from "zod";

export const createCharacterSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  fullDescription: z
    .string()
    .max(5000, "Full description must be less than 5000 characters")
    .optional(),
  personality: z
    .string()
    .max(2000, "Personality must be less than 2000 characters")
    .optional(),
  systemPrompt: z
    .string()
    .min(1, "System prompt is required")
    .max(10000, "System prompt must be less than 10000 characters"),
  behaviorAndTone: z
    .string()
    .max(2000, "Behavior and tone must be less than 2000 characters")
    .optional(),
  conversationTone: z
    .string()
    .max(1000, "Conversation tone must be less than 1000 characters")
    .optional(),
  brandGuidelines: z
    .string()
    .max(3000, "Brand guidelines must be less than 3000 characters")
    .optional(),
  customGreeting: z
    .string()
    .max(500, "Custom greeting must be less than 500 characters")
    .optional(),
  prompts: z
    .array(
      z.string().max(1000, "Each prompt must be less than 1000 characters")
    )
    .default([]),
  categoryId: z
    .string()
    .uuid("Category ID must be a valid UUID")
    .min(1, "Category is required"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;

export const createCharacterCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

export type CreateCharacterCategoryInput = z.infer<
  typeof createCharacterCategorySchema
>;
