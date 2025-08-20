"use server";

import { auth } from "@/auth";
import {
  EditCharacterInput,
  editCharacterSchema,
} from "../schemas/edit-character-schema";
import { db } from "@repo/db";
import { aiCharacter } from "@repo/db/schema";
import { eq } from "drizzle-orm";

/**
 * Edit a character
 * @param values - The values to edit the character with
 * @param userId - The id of the user editing the character
 * @returns The edited character
 */
export async function editCharacter(
  values: EditCharacterInput,
  userId: string,
  characterId: string
) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "You must be logged in to edit a character",
    };
  }

  const { success, data } = editCharacterSchema.safeParse(values);

  if (!success) {
    console.log("could not validate submission", data);

    return {
      success: false,
      message: "Invalid character data",
    };
  }

  try {
    const [editedCharacter] = await db
      .update(aiCharacter)
      .set({
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
      })
      .where(eq(aiCharacter.id, characterId))
      .returning();

    return {
      success: true,
      message: "Character edited successfully",
      editedCharacter,
    };
  } catch (error) {
    console.error("Error editing character", error);
    return {
      success: false,
      message: "An error occurred while editing the character",
    };
  }
}
