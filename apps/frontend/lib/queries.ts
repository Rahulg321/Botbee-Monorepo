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
  isNull,
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
  botChats,
  botChatMessages,
  type BotChat,
  promptCategory,
  prompt,
  aiCharacterCategory,
  aiCharacter,
} from "@repo/db/schema";
import { BotDocument, BotWithDocumentsCount } from "@repo/shared/types";
import { db } from "@repo/db";
import { generateHashedPassword } from "./utils";
import { ChatSDKError } from "./errors";

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
 * Delete a bot chat by id
 * @param id - The id of the chat to delete
 * @returns The deleted chat
 */
export async function deleteBotChatById({ id }: { id: string }) {
  try {
    const [chatsDeleted] = await db
      .delete(botChats)
      .where(eq(botChats.id, id))
      .returning();
    return chatsDeleted;
  } catch (error) {
    console.log(error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    );
  }
}

export async function getBotChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    const extendedLimit = limit + 1;

    const query = (whereCondition?: SQL<any>) =>
      db
        .select()
        .from(botChats)
        .where(
          whereCondition
            ? and(whereCondition, eq(botChats.userId, id))
            : eq(botChats.userId, id)
        )
        .orderBy(desc(botChats.createdAt))
        .limit(extendedLimit);

    let filteredChats: Array<BotChat> = [];

    if (startingAfter) {
      const [selectedChat] = await db
        .select()
        .from(botChats)
        .where(eq(botChats.id, startingAfter))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${startingAfter} not found`
        );
      }

      filteredChats = await query(
        gt(botChats.createdAt, selectedChat.createdAt)
      );
    } else if (endingBefore) {
      const [selectedChat] = await db
        .select()
        .from(botChats)
        .where(eq(botChats.id, endingBefore))
        .limit(1);

      if (!selectedChat) {
        throw new ChatSDKError(
          "not_found:database",
          `Chat with id ${endingBefore} not found`
        );
      }

      filteredChats = await query(
        lt(botChats.createdAt, selectedChat.createdAt)
      );
    } else {
      filteredChats = await query();
    }

    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }
}

/**
 * Get a bot chat by id
 * @param id - The id of the chat
 * @returns The chat
 */
export async function getBotChatById({ id }: { id: string }) {
  try {
    const [selectedChat] = await db
      .select()
      .from(botChats)
      .where(eq(botChats.id, id));
    return selectedChat;
  } catch (error) {
    console.log("error loading bot chat", error);

    return null;
  }
}

/**
 * Get a bot message by id
 * @param id - The id of the message
 * @returns The message
 */
export async function getBotMessageById({ id }: { id: string }) {
  try {
    return await db
      .select()
      .from(botChatMessages)
      .where(eq(botChatMessages.id, id));
  } catch (error) {
    console.log("An error occured trying to get message by id", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    );
  }
}

export async function deleteBotMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    const messagesToDelete = await db
      .select({ id: botChatMessages.id })
      .from(botChatMessages)
      .where(
        and(
          eq(botChatMessages.botChatId, chatId),
          gte(botChatMessages.createdAt, timestamp)
        )
      );

    const messageIds = messagesToDelete.map((message) => message.id);

    if (messageIds.length > 0) {
      return await db
        .delete(botChatMessages)
        .where(
          and(
            eq(botChatMessages.botChatId, chatId),
            inArray(botChatMessages.id, messageIds)
          )
        );
    }
  } catch (error) {
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete messages by chat id after timestamp"
    );
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

/**
 * Get all prompt categories
 * @returns The prompt categories
 */
export async function getPromptCategories() {
  try {
    return await db.select().from(promptCategory);
  } catch (error) {
    console.log("An error occured trying to get prompt categories", error);
    return null;
  }
}

/**
 * Get a prompt by id with category information
 * @param promptId - The id of the prompt
 * @returns The prompt with category details
 */
export async function getPromptById(promptId: string) {
  try {
    const result = await db
      .select({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        status: prompt.status,
        content: prompt.content,
        categoryId: prompt.categoryId,
        userId: prompt.userId,
        createdAt: prompt.createdAt,

        category: {
          id: promptCategory.id,
          name: promptCategory.name,
          description: promptCategory.description,
        },
      })
      .from(prompt)
      .leftJoin(promptCategory, eq(prompt.categoryId, promptCategory.id))
      .where(eq(prompt.id, promptId))
      .limit(1);

    return result[0] || null;
  } catch (error) {
    console.log("An error occurred trying to get prompt by id", error);
    return null;
  }
}

/**
 * Get all prompts
 * @returns The prompts
 */
export async function getAllPrompts() {
  try {
    return await db
      .select({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        status: prompt.status,
      })
      .from(prompt);
  } catch (error) {
    console.log("An error occured trying to get all prompts", error);
    return null;
  }
}

/**
 * Get all template prompts
 * @returns The template prompts
 */
export async function getAllTemplatePrompts() {
  //get all prompts where userId is undefined

  try {
    return await db.select().from(prompt).where(isNull(prompt.userId));
  } catch (error) {
    console.log("An error occured trying to get all template prompts", error);
    return null;
  }
}

/**
 * Get all prompts by user id
 * @param userId - The id of the user
 * @returns The prompts by user id
 */
export async function getAllPromptsByUserId(userId: string) {
  try {
    return await db.select().from(prompt).where(eq(prompt.userId, userId));
  } catch (error) {
    console.log("An error occured trying to get all prompts by user id", error);
    return null;
  }
}

/**
 * Get all ai character categories
 * @returns The ai character categories
 */
export async function getAiCharacterCategories() {
  try {
    return await db.select().from(aiCharacterCategory);
  } catch (error) {
    console.log(
      "An error occured trying to get ai character categories",
      error
    );
    return null;
  }
}

/**
 * Get all ai characters by user id with category information
 * @param userId - The id of the user
 * @returns The ai characters by user id with category details
 */
export async function getAiCharactersByUserId(userId: string) {
  try {
    return await db
      .select({
        id: aiCharacter.id,
        name: aiCharacter.name,
        description: aiCharacter.description,
        fullDescription: aiCharacter.fullDescription,
        personality: aiCharacter.personality,
        systemPrompt: aiCharacter.systemPrompt,
        behaviorAndTone: aiCharacter.behaviorAndTone,
        conversationTone: aiCharacter.conversationTone,
        brandGuidelines: aiCharacter.brandGuidelines,
        customGreeting: aiCharacter.customGreeting,
        prompts: aiCharacter.prompts,
        status: aiCharacter.status,
        createdAt: aiCharacter.createdAt,
        updatedAt: aiCharacter.updatedAt,
        category: {
          id: aiCharacterCategory.id,
          name: aiCharacterCategory.name,
          description: aiCharacterCategory.description,
        },
      })
      .from(aiCharacter)
      .leftJoin(
        aiCharacterCategory,
        eq(aiCharacter.categoryId, aiCharacterCategory.id)
      )
      .where(eq(aiCharacter.userId, userId));
  } catch (error) {
    console.log(
      "An error occured trying to get ai characters by user id",
      error
    );
    return null;
  }
}

/**
 * Get all template ai characters with category information, these ai characters were created by the system and not by the user
 * @returns The template ai characters with category details
 */
export async function getTemplateAiCharacters() {
  try {
    return await db
      .select({
        id: aiCharacter.id,
        name: aiCharacter.name,
        description: aiCharacter.description,
        fullDescription: aiCharacter.fullDescription,
        personality: aiCharacter.personality,
        systemPrompt: aiCharacter.systemPrompt,
        behaviorAndTone: aiCharacter.behaviorAndTone,
        conversationTone: aiCharacter.conversationTone,
        brandGuidelines: aiCharacter.brandGuidelines,
        customGreeting: aiCharacter.customGreeting,
        prompts: aiCharacter.prompts,
        status: aiCharacter.status,
        createdAt: aiCharacter.createdAt,
        updatedAt: aiCharacter.updatedAt,
        category: {
          id: aiCharacterCategory.id,
          name: aiCharacterCategory.name,
          description: aiCharacterCategory.description,
        },
      })
      .from(aiCharacter)
      .leftJoin(
        aiCharacterCategory,
        eq(aiCharacter.categoryId, aiCharacterCategory.id)
      )
      .where(isNull(aiCharacter.userId));
  } catch (error) {
    console.log("An error occured trying to get template ai characters", error);
    return null;
  }
}

/**
 * Get an ai character by id with category information
 * @param characterId - The id of the ai character
 * @returns The ai character with category details
 */
export async function getAiCharacterById(characterId: string) {
  try {
    const [foundCharacter] = await db
      .select({
        id: aiCharacter.id,
        name: aiCharacter.name,
        description: aiCharacter.description,
        fullDescription: aiCharacter.fullDescription,
        personality: aiCharacter.personality,
        systemPrompt: aiCharacter.systemPrompt,
        behaviorAndTone: aiCharacter.behaviorAndTone,
        conversationTone: aiCharacter.conversationTone,
        brandGuidelines: aiCharacter.brandGuidelines,
        customGreeting: aiCharacter.customGreeting,
        prompts: aiCharacter.prompts,
        status: aiCharacter.status,
        createdAt: aiCharacter.createdAt,
        updatedAt: aiCharacter.updatedAt,
        userId: aiCharacter.userId,
        category: {
          id: aiCharacterCategory.id,
          name: aiCharacterCategory.name,
          description: aiCharacterCategory.description,
        },
      })
      .from(aiCharacter)
      .leftJoin(
        aiCharacterCategory,
        eq(aiCharacter.categoryId, aiCharacterCategory.id)
      )
      .where(eq(aiCharacter.id, characterId))
      .limit(1);

    return foundCharacter;
  } catch (error) {
    console.log("An error occured trying to get ai character by id", error);
    return null;
  }
}
