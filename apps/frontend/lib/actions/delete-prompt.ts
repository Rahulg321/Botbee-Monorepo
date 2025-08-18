"use server";

import { auth } from "@/auth";
import { db } from "@repo/db";
import { prompt } from "@repo/db/schema";
import { eq } from "drizzle-orm";

/**
 * Delete a prompt by its id
 */
export async function deletePrompt(promptId: string) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  if (!promptId) {
    return {
      success: false,
      message: "Prompt ID is required",
    };
  }

  try {
    await db.delete(prompt).where(eq(prompt.id, promptId));
    return {
      success: true,
      message: "Prompt deleted successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed to delete prompt",
    };
  }
}
