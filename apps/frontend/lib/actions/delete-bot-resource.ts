"use server";

import { auth } from "@/auth";
import { botResourceEmbeddings, botResources } from "@repo/db/schema";
import { db } from "@repo/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteBotResourceServerAction(botResourceId: string) {
  const userSession = await auth();
  if (!userSession) {
    return {
      type: "error",
      message: "Unauthorized",
    };
  }

  try {
    console.log("Deleting bot resource embeddings");

    await db
      .delete(botResourceEmbeddings)
      .where(eq(botResourceEmbeddings.botResourceId, botResourceId));

    console.log("Deleting bot resource");

    await db.delete(botResources).where(eq(botResources.id, botResourceId));

    console.log("Revalidating path");

    revalidatePath("/bot-documents");

    return {
      type: "success",
      message: "Resource deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      type: "error",
      message: "Failed to delete resource",
    };
  }
}
