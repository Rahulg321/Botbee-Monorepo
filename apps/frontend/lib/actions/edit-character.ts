"use server";

import { auth } from "@/auth";
import { editCharacterSchema } from "../schemas/edit-character-schema";
import { db } from "@repo/db";
import { aiCharacter } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { put } from "@vercel/blob";

/**
 * Edit a character
 * @param formData - The form data to edit the character with
 * @param userId - The id of the user editing the character
 * @param characterId - The id of the character to edit
 * @returns The edited character
 */
export async function editCharacter(
  formData: FormData,
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

  const name = formData.get("name") as string;
  const systemPrompt = formData.get("systemPrompt") as string;
  const prompts = JSON.parse(formData.get("prompts") as string);
  const categoryId = formData.get("categoryId") as string;
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;
  const fullDescription = formData.get("fullDescription") as string;
  const personality = formData.get("personality") as string;
  const behaviorAndTone = formData.get("behaviorAndTone") as string;
  const conversationTone = formData.get("conversationTone") as string;
  const brandGuidelines = formData.get("brandGuidelines") as string;
  const customGreeting = formData.get("customGreeting") as string;
  const image = formData.get("image") as File;

  const values = {
    name,
    systemPrompt,
    prompts,
    categoryId,
    status,
    description,
    fullDescription,
    personality,
    behaviorAndTone,
    conversationTone,
    brandGuidelines,
    customGreeting,
    image,
  };

  console.log("values", values);

  const { success, data } = editCharacterSchema.safeParse(values);

  if (!success) {
    console.log("could not validate submission", data);
    return {
      success: false,
      message: "Invalid character data",
    };
  }

  console.log("data", data);

  let fileUrl = "";

  if (data.image) {
    try {
      const blob = await put(data.image.name, data.image, {
        access: "public",
      });
      fileUrl = blob.url;
    } catch (error) {
      console.error("error uploading image", error);
      return {
        success: false,
        message: "An error occurred while uploading the image",
      };
    }
  }

  try {
    const updateData: any = {
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
      userId: userId,
      updatedAt: new Date(),
    };

    // Only update imageUrl if a new image was uploaded
    if (fileUrl) {
      updateData.imageUrl = fileUrl;
    }

    const [editedCharacter] = await db
      .update(aiCharacter)
      .set(updateData)
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
