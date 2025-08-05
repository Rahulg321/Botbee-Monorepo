import { z } from "zod";

// Schema for validating a browser File instance (client-side)
const fileInputSchema = z.instanceof(File);

export const createBotSchema = z
  .object({
    name: z.string().min(1, "Bot name is required"),
    language: z.string().min(1, "Language is required"),
    greeting: z.string().min(1, "Greeting is required"),
    avatar: z.string().min(1, "Avatar is required"),

    dataFile: fileInputSchema.optional(),

    dataFileTitle: z.string().optional(),
    dataFileDescription: z.string().optional(),

    brandGuidelines: z.string().min(1, "Brand guidelines are required"),

    url: z
      .string()
      .url("Invalid URL format")
      .startsWith("https://", "Please enter a valid URL starting with https://")
      .optional(),

    tone: z.string().min(1, "Tone is required"),
    instructions: z.string().min(1, "Instructions are required"),
  })
  // At least one of dataFile or url must be provided
  .refine(
    (data) => {
      return (
        Boolean(data.dataFile) || Boolean(data.url && data.url.trim() !== "")
      );
    },
    {
      message: "Data file or URL is required",
      path: ["general"],
    }
  )
  // If a file is provided, its title becomes mandatory
  .refine(
    (data) => {
      if (data.dataFile) {
        return !!(data.dataFileTitle && data.dataFileTitle.trim().length > 0);
      }
      return true;
    },
    {
      message: "Data file title is required when a file is uploaded",
      path: ["dataFileTitle"],
    }
  );

// Type inference from the schema
export type CreateBotFormData = z.infer<typeof createBotSchema>;

export const createBotFormSchema = z
  .object({
    name: z.string().min(1, "Bot name is required"),
    language: z.string().min(1, "Language is required"),
    greeting: z.string().min(1, "Greeting is required"),
    avatar: z.string().optional(),
    dataFile: fileInputSchema,
    dataFileTitle: z.string().min(1, "Data file title is required"),
    dataFileDescription: z.string().optional(),
    brandGuidelines: z.string().min(1, "Brand guidelines are required"),
    url: z
      .string()
      .url("Invalid URL format")
      .startsWith("https://", "Please enter a valid URL starting with https://")
      .optional(),
    tone: z.string().min(1, "Tone is required"),
    instructions: z.string().min(1, "Instructions are required"),
  })
  .refine(
    (data) => {
      return true;
    },
    {
      message: "Custom validation failed",
      path: ["custom"],
    }
  );

// Base schema without cross-field refinements – this allows us to create a
// partial version later without running into ZodEffects type limitations.
export const baseSchema = z.object({
  name: z.string().min(1, "Bot name is required"),
  language: z.string().min(1, "Language is required"),
  greeting: z.string().min(1, "Greeting is required"),
  avatar: z.string().min(1, "Avatar is required"),

  // File is optional – user may choose to only supply a URL.
  dataFile: fileInputSchema.optional(),

  // Title is optional by default but will be enforced through a refinement
  dataFileTitle: z.string().optional(),
  dataFileDescription: z.string().optional(),

  brandGuidelines: z.string().min(1, "Brand guidelines are required"),

  // URL is optional – user may choose to only upload a file.
  url: z
    .string()
    .url("Invalid URL format")
    .startsWith("https://", "Please enter a valid URL starting with https://")
    .optional(),

  tone: z.string().min(1, "Tone is required"),
  instructions: z.string().min(1, "Instructions are required"),
});
