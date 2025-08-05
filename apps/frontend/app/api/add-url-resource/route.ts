import { auth } from "@/auth";
import { scrapeWebsite } from "@/lib/firecrawl";
import { generateEmbeddingsFromContent } from "@/lib/ai/generate-embeddings-content";
import { db } from "@repo/db";
import { botResourceEmbeddings, botResources } from "@repo/db/schema";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const url = formData.get("url") as string;
  const botId = formData.get("botId") as string;

  const userSession = await auth();

  if (!userSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!url || !botId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  let scrapedData = "";

  if (url) {
    try {
      console.log("scraping website");
      const scrapeResult = await scrapeWebsite(url);
      scrapedData = JSON.stringify(
        scrapeResult.markdown && scrapeResult.metadata
      );
    } catch (error) {
      console.log("Error scraping website:", error);
      return NextResponse.json(
        { error: "Failed to scrape website" },
        { status: 500 }
      );
    }
  }

  let websiteEmbeddings;

  if (scrapedData) {
    try {
      console.log("generating website embeddings");
      const { embeddings } = await generateEmbeddingsFromContent(scrapedData);
      console.log("website embeddings generated");
      websiteEmbeddings = embeddings;
    } catch (error) {
      console.log("Error:", error);
      return NextResponse.json(
        { error: "Failed to generate embeddings" },
        { status: 500 }
      );
    }

    try {
      console.log("inserting website resource");
      const [insertedWebsiteResource] = await db
        .insert(botResources)
        .values({
          botId: botId,
          name: `Website ${url}`,
          description: "Website content",
          kind: "url",
          userId: userSession.user.id,
          fileSize: "0",
        })
        .returning();

      console.log("inserting website resource embeddings");
      await db.insert(botResourceEmbeddings).values(
        websiteEmbeddings.map((embedding) => ({
          botResourceId: insertedWebsiteResource!.id,
          ...embedding,
        }))
      );
      console.log("inserted website resource embeddings");

      revalidatePath(`/bot-documents`);

      return NextResponse.json(
        { message: "Website resource added successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.log("Error inserting website resource:", error);
      return NextResponse.json(
        { error: "Failed to insert website resource" },
        { status: 500 }
      );
    }
  }
}
