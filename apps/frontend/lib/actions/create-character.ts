"use server";

import { auth } from "@/auth";
import {
  CreateCharacterInput,
  createCharacterSchema,
} from "../schemas/create-character-schema";
import { db } from "@repo/db";
import { aiCharacter } from "@repo/db/schema";
import { put } from "@vercel/blob";

/**
 * Create a new character
 * @param formData - The form data to create the character with
 * @param userId - The id of the user creating the character
 * @returns The created character
 */
export async function createCharacter(formData: FormData, userId: string) {
  const userSession = await auth();

  if (!userSession) {
    return {
      success: false,
      message: "You must be logged in to create a character",
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

  const { success, data } = createCharacterSchema.safeParse(values);

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
    const [insertedCharacter] = await db
      .insert(aiCharacter)
      .values({
        name: name,
        description: data.description,
        fullDescription: data.fullDescription,
        personality: data.personality,
        systemPrompt: data.systemPrompt,
        behaviorAndTone: data.behaviorAndTone,
        conversationTone: data.conversationTone,
        brandGuidelines: data.brandGuidelines,
        customGreeting: data.customGreeting,
        imageUrl: fileUrl,
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
