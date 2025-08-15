import { cosineDistance } from "drizzle-orm";
// import { botResourceEmbeddings, botResources } from "../db/schema";
// import { generateEmbedding } from "./embedding";
// import { db } from "../db/queries";

// export const findRelevantContent = async (userQuery: string, botId: string) => {
//   if (!botId) {
//     console.log("Bot ID is not available inside tool call");
//     throw new Error("Bot ID is required");
//   }

//   const userQueryEmbedded = await generateEmbedding(userQuery);

//   const similarity = sql<number>`1 - (${cosineDistance(
//     botResourceEmbeddings.embedding,
//     userQueryEmbedded
//   )})`;

//   const [mostRelevant] = await db
//     .select({ content: botResourceEmbeddings.content, similarity })
//     .from(botResourceEmbeddings)
//     .innerJoin(
//       botResources,
//       eq(botResources.id, botResourceEmbeddings.botResourceId)
//     )
//     .where(and(eq(botResources.botId, botId), gt(similarity, 0.7)))
//     .orderBy((t) => desc(t.similarity))
//     .limit(1);

//   if (!mostRelevant) return null;

//   return {
//     ...mostRelevant,
//     content: mostRelevant.content,
//   };
// };

import { desc, gt, sql, eq, and, or } from "drizzle-orm";
import { botResourceEmbeddings, botResources } from "@repo/db/schema";
import { generateEmbedding } from "./embedding";
import { db } from "@repo/db";

export const findRelevantContent = async (userQuery: string, botId: string) => {
  if (!botId) {
    console.log("Bot ID is not available inside tool call");
    return {
      success: false,
      reason: "Bot ID is not available inside tool call",
    };
  }
  if (!userQuery) {
    console.log("User query is not available inside tool call");
    return {
      success: false,
      reason: "User query is not available inside tool call",
    };
  }

  // 1. Generate embedding for query
  const queryEmbed = await generateEmbedding(userQuery);

  if (!queryEmbed)
    return {
      success: false,
      reason: "Embeddings could not be generated",
    };

  // 2. Fetch top-K candidate chunks with sparse filter & vector score

  let candidates;

  try {
    candidates = await db
      .select({
        id: botResourceEmbeddings.id,
        content: botResourceEmbeddings.content,
        similarity: sql<number>`1 - (${cosineDistance(botResourceEmbeddings.embedding, queryEmbed)})`,
      })
      .from(botResourceEmbeddings)
      .innerJoin(
        botResources,
        eq(botResources.id, botResourceEmbeddings.botResourceId)
      )
      .where(and(eq(botResources.botId, botId)))
      .orderBy((t) => desc(t.similarity))
      .limit(10);
  } catch (error) {
    console.error("Error fetching candidates:", error);
    return {
      success: false,
      reason: "error-fetching-candidates",
    };
  }

  if (!candidates || candidates.length === 0)
    return {
      success: false,
      reason: "No candidates found",
    };

  const scores = candidates.map((c) => c.similarity);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;

  const std = Math.sqrt(
    scores.map((s) => (s - mean) ** 2).reduce((a, b) => a + b, 0) /
      scores.length
  );
  const threshold = mean - std * 0.5;
  const filtered = candidates.filter((c) => c.similarity >= threshold);

  if (filtered.length === 0) {
    return {
      success: true,
      message: "No candidates above threshold",
      content: candidates[0]?.content || "",
      similarity: candidates[0]?.similarity || 0,
    };
  }

  const lambda = 0.5;
  const selected: typeof filtered = [];
  const remaining = [...filtered];

  while (selected.length < 3 && remaining.length > 0) {
    let best = remaining[0];
    let bestScore = -Infinity;

    for (const cand of remaining) {
      const relevance = cand.similarity;

      const diversity = selected.length
        ? Math.max(
            ...selected.map((s) => Math.abs(s.similarity - cand.similarity))
          )
        : 1;

      const score = lambda * relevance + (1 - lambda) * diversity;

      if (score > bestScore) {
        best = cand;
        bestScore = score;
      }
    }

    if (best) {
      selected.push(best);
      remaining.splice(remaining.indexOf(best), 1);
    }
  }

  const mostRelevant = selected.reduce((best, current) =>
    current.similarity > best.similarity ? current : best
  );

  return {
    success: true,
    message: "Found relevant content",
    content: mostRelevant.content || "",
    similarity: mostRelevant.similarity || 0,
  };
};
