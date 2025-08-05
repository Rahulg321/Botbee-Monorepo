import "server-only";

import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  ilike,
  type SQL,
} from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  user,
  chat,
  type User,
  document,
  type Suggestion,
  suggestion,
  message,
  vote,
  type DBMessage,
  type Chat,
  stream,
  passwordResetToken,
  verificationToken,
  bot,
  botResources,
  botTemplates,
} from "@repo/db/schema";
import { BotDocument, BotWithDocumentsCount } from "@repo/shared/types";
import { db } from "@repo/db";
import { generateHashedPassword } from "./utils";

/**
 * Get filtered bot documents by user id with pagination
 * @param userId - The id of the user
 * @param query - Optional search query for file name
 * @param offset - Optional offset for pagination
 * @param limit - Optional limit for pagination
 * @returns The filtered bot documents, total pages, and total documents
 */
export async function getBotDocumentsByUserId(
  userId: string,
  query?: string,
  offset?: number,
  limit?: number
) {
  try {
    const whereClause = query
      ? ilike(botResources.name, `%${query}%`)
      : undefined;

    const documents = await db
      .select({
        id: botResources.id,
        botId: botResources.botId,
        botName: bot.name,
        fileName: botResources.name,
        fileType: botResources.kind,
        fileSize: botResources.fileSize,
        createdAt: botResources.createdAt,
      })
      .from(botResources)
      .leftJoin(bot, eq(botResources.botId, bot.id))
      .where(and(eq(botResources.userId, userId), whereClause))
      .orderBy(desc(botResources.createdAt))
      .limit(limit ?? 50)
      .offset(offset ?? 0);

    const [{ total } = { total: 0 }] = await db
      .select({ total: count(botResources.id) })
      .from(botResources)
      .where(and(eq(botResources.userId, userId), whereClause));

    const totalPages = Math.ceil(Number(total) / (limit ?? 50));

    // Ensure botName is always a string
    const safeDocuments = documents.map((doc) => ({
      ...doc,
      botName: doc.botName ?? "",
    }));

    return { documents: safeDocuments, totalPages, totalDocuments: total };
  } catch (error) {
    console.log(
      "An error occurred trying to get filtered bot documents by user id",
      error
    );
    return { documents: [], totalPages: 0, totalDocuments: 0 };
  }
}

/**
 * Get a bot by id
 * @param id - The id of the bot
 * @returns The bot
 */
export async function getBotById(id: string) {
  try {
    const [foundBot] = await db.select().from(bot).where(eq(bot.id, id));
    return foundBot;
  } catch (error) {
    console.log("An error occured trying to get bot by id", error);
    return null;
  }
}

/**
 * Get a user by id
 * @param id - The id of the user
 * @returns The user
 */
export async function getUserById(id: string) {
  try {
    const [foundUser] = await db.select().from(user).where(eq(user.id, id));
    return foundUser;
  } catch (error) {
    console.log("An error occured trying to get user by id", error);
    return null;
  }
}

/**
 * Get a password reset token by email
 * @param email - The email to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.email, email));
    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by email",
      error
    );
    return null;
  }
}

/**
 * Get a verification token by email
 * @param email - The email to get the verification token for
 * @returns The verification token
 */
export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const [userVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.email, email));
    return userVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by email",
      error
    );
    return null;
  }
};

/**
 * Get a password reset token by token
 * @param token - The token to get the password reset token for
 * @returns The password reset token
 */
export async function getPasswordResetTokenByToken(token: string) {
  try {
    const [foundPasswordResetToken] = await db
      .select()
      .from(passwordResetToken)
      .where(eq(passwordResetToken.token, token));

    return foundPasswordResetToken;
  } catch (error) {
    console.log(
      "An error occured trying to get password reset token by token",
      error
    );
    return null;
  }
}

/**
 * Get created bots by user id
 * @param userId - The id of the user
 * @returns The created bots
 */
export async function getCreatedBotsByUserId(userId: string) {
  try {
    const foundCreatedBots = await db
      .select()
      .from(bot)
      .where(eq(bot.userId, userId));
    return foundCreatedBots;
  } catch (error) {
    console.log(
      "An error occured trying to get created bots by user id",
      error
    );
    return null;
  }
}

/**
 * Fetch bots with documents count
 * @param userId - The id of the user
 * @returns The bots with documents count
 * @example
 * ```typescript
 * // Example return value:
 * [
 *   { id: "bot-1", name: "Customer Support", documentCount: 5 },
 *   { id: "bot-2", name: "Sales Assistant", documentCount: 0 }
 * ]
 * ```
 */
export async function fetchBotsWithDocumentsCount(
  userId: string
): Promise<BotWithDocumentsCount> {
  try {
    const foundBots = await db
      .select({
        id: bot.id,
        name: bot.name,
        documentCount: count(botResources.id),
      })
      .from(bot)
      .leftJoin(botResources, eq(bot.id, botResources.botId))
      .where(eq(bot.userId, userId))
      .groupBy(bot.id, bot.name)
      .orderBy(asc(bot.name))
      .execute();
    return foundBots;
  } catch (error) {
    console.log(
      "An error occured trying to fetch bots with documents count",
      error
    );
    return null;
  }
}

/**
 * Get a verification token by token
 * @param token - The token to get the verification token for
 * @returns The verification token
 */
export async function getVerificationTokenByToken(token: string) {
  try {
    const [foundVerificationToken] = await db
      .select()
      .from(verificationToken)
      .where(eq(verificationToken.token, token));
    return foundVerificationToken;
  } catch (error) {
    console.log(
      "An error occured trying to get verification token by token",
      error
    );
    return null;
  }
}

/**
 * Get a user by email
 * @param email - The email to get the user for
 * @returns The user
 */
export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    throw new Error("Failed to get user by email");
  }
}

export async function getBotTemplates() {
  try {
    return await db.select().from(botTemplates);
  } catch (error) {
    console.log("An error occured trying to get bot templates", error);
    return null;
  }
}

export async function getBotTemplateByUid(uid: string) {
  try {
    return await db.select().from(botTemplates).where(eq(botTemplates.id, uid));
  } catch (error) {
    console.log("An error occured trying to get bot template by uid", error);
    return null;
  }
}

/**
 * Create a user
 * @param email - The email of the user
 * @param password - The password of the user
 * @returns The user
 */
export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  try {
    return await db.insert(user).values({ email, password: hashedPassword });
  } catch (error) {
    console.log("An error occured trying to create user", error);
    throw new Error("Failed to create user");
  }
}
