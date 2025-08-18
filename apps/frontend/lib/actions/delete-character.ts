"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { aiCharacter } from "@repo/db/schema";
import { eq } from "drizzle-orm";

/**
 * Delete a character by its id
 */
export async function deleteCharacter(characterId: string) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!characterId) {
    return {
      success: false,
      message: "Character ID is required",
    };
  }

  try {
    await db.delete(aiCharacter).where(eq(aiCharacter.id, characterId));
    return {
      success: true,
      message: "Character deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed to delete character",
    };
  }
}
