"use server";

import { auth } from "@/auth";
import {
  CreatePromptInput,
  createPromptSchema,
} from "../schemas/create-prompt-schema";
import { db } from "@repo/db";
import { prompt } from "@repo/db/schema";

/**
 * Create a new prompt
 * @param values - The values to create the prompt with
 * @returns The created prompt
 */
export async function createPrompt(values: CreatePromptInput, userId: string) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "You must be logged in to create a prompt",
    };
  }

  const { success, data } = createPromptSchema.safeParse(values);

  if (!success) {
    console.log("could not validate submission", data);

    return {
      success: false,
      message: "Invalid prompt data",
    };
  }

  console.log("inside create prompt", values);

  try {
    const [insertedPrompt] = await db
      .insert(prompt)
      .values({
        title: data.title,
        description: data.description,
        content: data.content,
        categoryId: data.categoryId,
        status: data.status,
        userId,
      })
      .returning();

    return {
      success: true,
      message: "Prompt created successfully",
      insertedPrompt,
    };
  } catch (error) {
    console.error("Error creating prompt", error);
    return {
      success: false,
      message: "An error occurred while creating the prompt",
    };
  }
}
