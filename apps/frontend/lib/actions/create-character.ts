"use server";

import { auth } from "@/auth";
import {
  CreateCharacterInput,
  createCharacterSchema,
} from "../schemas/create-character-schema";
import { db } from "@repo/db";
import { aiCharacter } from "@repo/db/schema";

/**
 * Create a new character
 * @param values - The values to create the character with
 * @param userId - The id of the user creating the character
 * @returns The created character
 */
export async function createCharacter(
  values: CreateCharacterInput,
  userId: string
) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "You must be logged in to create a character",
    };
  }

  const { success, data } = createCharacterSchema.safeParse(values);

  if (!success) {
    console.log("could not validate submission", data);

    return {
      success: false,
      message: "Invalid character data",
    };
  }

  try {
    const [insertedCharacter] = await db
      .insert(aiCharacter)
      .values({
        name: data.name,
        description: data.description,
        fullDescription: data.fullDescription,
        personality: data.personality,
        systemPrompt: data.systemPrompt,
        behaviorAndTone: data.behaviorAndTone,
        conversationTone: data.conversationTone,
        brandGuidelines: data.brandGuidelines,
        customGreeting: data.customGreeting,
        prompts: data.prompts,
        categoryId: data.categoryId,
        status: data.status,
        userId,
      })
      .returning();

    return {
      success: true,
      message: "Character created successfully",
      insertedCharacter,
    };
  } catch (error) {
    console.error("Error creating character", error);
    return {
      success: false,
      message: "An error occurred while creating the character",
    };
  }
}
