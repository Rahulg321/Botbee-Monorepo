import { db } from "@repo/db";
import { asc } from "drizzle-orm";
import {
  botChatMessages,
  botChats,
  botChatStream,
  message,
} from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { UIMessage } from "ai";
import { v4 as uuidv4 } from "uuid";

/**
 * Creates a new chat
 * @param userId - The ID of the user
 * @param botId - The ID of the bot
 * @returns The ID of the new chat
 */
export async function createChat({
  userId,
  botId,
}: {
  userId: string;
  botId: string;
}): Promise<string> {
  try {
    console.log("inside create Chat", userId, botId);

    const newChatId = uuidv4();

    // Insert a new record into the 'chats' table
    await db.insert(botChats).values({
      id: newChatId,
      userId: userId,
      botId: botId,
    });

    return newChatId;
  } catch (error) {
    console.error("error creating chat", error);
    throw error;
  }
}

/**
 * Loads a chat from the database
 * @param id - The ID of the chat
 * @returns The chat messages
 */
export async function loadChat(id: string): Promise<UIMessage[]> {
  console.log("inside load chat ", id);

  if (!id) {
    console.log("did not provide chatid to load messages");
    return [];
  }

  let dbMessages;

  try {
    dbMessages = await db
      .select()
      .from(botChatMessages)
      .where(eq(botChatMessages.botChatId, id))
      .orderBy(asc(botChatMessages.createdAt));

    console.log("dbMessages", dbMessages);
  } catch (error) {
    console.error("error loading chat", error);
    return [];
  }

  if (!dbMessages) {
    return [];
  }

  console.log("inside db messages", dbMessages);

  return dbMessages.map(
    (message) =>
      ({
        id: message.messageId || message.id,
        metadata: message.metadata,
        role: message.role,
        // The UIMessage format expects content in a `parts` array.
        parts: message.parts || [{ type: "text", text: message.content }],
      }) as UIMessage
  );
}

/**
 * Saves a chat to the database
 * @param chatId - The ID of the chat
 * @param messages - The messages to save
 */
export async function saveChat({
  chatId,
  messages,
}: {
  chatId: string;
  messages: UIMessage[];
}): Promise<void> {
  try {
    // console.log("inside save chat with chatId", chatId);
    console.log("inside save chat with messages", messages);

    messages.map((e, index) => {
      console.log(`message ${index} parts`, e.parts);
      console.log(`message ${index} role`, e.role);
      console.log(`message ${index} id`, e.id);
      console.log(`message ${index} metadata`, e.metadata);
    });

    // Map UIMessages to the format expected by our 'messages' table schema
    const newMessages = messages.map((message) => ({
      botChatId: chatId,
      messageId: message.id,
      role: message.role,
      parts: message.parts,
      metadata: message.metadata,
      content: message.parts
        .map((part) => ("text" in part ? part.text : ""))
        .filter(Boolean)
        .join(""),
    }));

    await db.insert(botChatMessages).values(newMessages).onConflictDoNothing();
  } catch (error) {
    console.error("error saving chat", error);
    throw error;
  }
}

// Appends a new stream ID to a chat
export async function appendStreamId({
  chatId,
  streamId,
}: {
  chatId: string;
  streamId: string;
}): Promise<void> {
  try {
    console.log("inside append stream id", chatId, streamId);

    await db.insert(botChatStream).values({
      id: streamId,
      botChatId: chatId,
    });
  } catch (error) {
    console.error("error appending stream id", error);
    throw error;
  }
}

export async function loadStreams(chatId: string): Promise<string[]> {
  console.log("inside loadStream", chatId);

  try {
    const dbStreams = await db
      .select()
      .from(botChatStream)
      .where(eq(botChatStream.botChatId, chatId))
      .orderBy(asc(botChatStream.createdAt));

    return dbStreams.map((stream) => stream.id);
  } catch (error) {
    console.error("error loading streams", error);
    return [];
  }
}
