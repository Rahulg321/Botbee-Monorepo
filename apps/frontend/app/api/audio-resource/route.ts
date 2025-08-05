import { googleGenAIProvider } from "@/lib/ai/providers";
import { newAudioFormSchema } from "@/lib/schemas/new-audio-form-schema";
import { NextRequest, NextResponse } from "next/server";
import { createUserContent, createPartFromUri } from "@google/genai";
import { db } from "@repo/db";
import {
  generateEmbeddingsFromChunks,
  generateChunksFromText,
} from "@/lib/ai/embedding";
import { botResources, botResourceEmbeddings } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  console.log("add-audio-resource route");

  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const botId = formData.get("botId") as string;

  const validatedData = newAudioFormSchema.safeParse({
    name,
    description,
    file,
    botId,
  });

  if (!validatedData.success) {
    console.log("Invalid data", validatedData.error);
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  console.log("generating transcription");

  const myfile = await googleGenAIProvider.files.upload({
    file: validatedData.data.file,
    config: { mimeType: "audio/mpeg" },
  });

  if (!myfile.uri || !myfile.mimeType) {
    console.error("File upload failed: missing uri or mimeType");
    throw new Error("File upload failed: missing uri or mimeType");
  }

  console.log("blob uploaded successfully");
  console.log("blob", myfile.uri);
  let result;

  try {
    result = await googleGenAIProvider.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        "Generate Raw Transcript of the audio file",
      ]),
    });
  } catch (error) {
    console.error("Error generating transcription from audio file", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }

  const transcription = result.text;

  const content = `AUDIO FILE NAME: ${name}\nDescription: ${description}\n\n Original Content:\n\n${transcription}`;

  const kind = "audio";
  const chunks = await generateChunksFromText(content!);
  const embeddingInput = chunks.chunks.map((chunk: any) => chunk.pageContent);
  console.log("Chunks length", chunks.chunks.length);

  let embeddings;

  try {
    embeddings = await generateEmbeddingsFromChunks(embeddingInput);
  } catch (error) {
    console.error("Error generating embeddings", error);
    return NextResponse.json(
      { error: "Failed to generate embeddings" },
      { status: 500 }
    );
  }

  try {
    const [resource] = await db
      .insert(botResources)
      .values({
        name,
        botId,
        kind: kind as any,
        fileSize: file.size.toString(),
        description,
        userId: userSession.user.id,
      })
      .returning();

    console.log("resource created", resource);

    await db.insert(botResourceEmbeddings).values(
      embeddings.map((embedding) => ({
        botResourceId: resource?.id as string,
        ...embedding,
      }))
    );
  } catch (error) {
    console.error("Error creating resource and embeddings", error);
    return NextResponse.json(
      { error: "Failed to create resource and embeddings" },
      { status: 500 }
    );
  }

  console.log("revalidating path");

  revalidatePath(`/bot-documents`);

  return NextResponse.json({ content }, { status: 200 });
}
