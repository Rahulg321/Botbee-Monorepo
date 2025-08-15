import { auth } from "@/auth";
import { generateTitleFromUserMessage } from "@/lib/actions";
import { buildBotSystemPrompt } from "@/lib/ai/prompts";
import { googleAISDKProvider } from "@/lib/ai/providers";
import { askForConfirmation } from "@/lib/ai/tools/ask-confirmation-tool";
import { getInformation } from "@/lib/ai/tools/find-relevant-content";
import { weatherTool } from "@/lib/ai/tools/weather-tool";
import { loadChat, saveChat, saveChatTitle } from "@/lib/chat-store";
import { ChatSDKError } from "@/lib/errors";
import { deleteBotChatById, getBotChatById } from "@/lib/queries";
import { db } from "@repo/db";
import {
  convertToModelMessages,
  createIdGenerator,
  stepCountIs,
  streamText,
  UIMessage,
} from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  const userSession = await auth();

  if (!userSession) {
    return new ChatSDKError("bad_request:auth", "Unauthorized").toResponse();
  }

  const body = await req.json();

  // console.log("body inside chat request", body);

  const {
    id,
    message,
    model,
    webSearch,
    botId,
    chatId,
    language,
    tone,
    greeting,
    brandGuidelines,
    instructions,
    botName,
  } = body;

  if (!botId) {
    return new ChatSDKError(
      "bad_request:api",
      "Bot ID is required"
    ).toResponse();
  }

  if (!chatId) {
    return new ChatSDKError(
      "bad_request:api",
      "Chat ID is required"
    ).toResponse();
  }

  const chat = await getBotChatById({ id });

  if (!chat) {
    console.log(
      "chat does not exist, this should not happen since chat is created in page component"
    );

    return new ChatSDKError("bad_request:api", "Chat not found").toResponse();
  }

  // Check if the user owns this chat
  if (chat.userId !== userSession.user.id) {
    console.log("user id does not match with the chat");
    return new ChatSDKError("forbidden:chat").toResponse();
  }

  // Update chat title if it doesn't have one
  if (!chat.title) {
    console.log("generating title for existing chat");
    const title = await generateTitleFromUserMessage({
      message,
    });

    console.log("title generated", title);

    await saveChatTitle({
      chatId: id,
      title,
    });
  }

  // const {
  //   chatId,
  //   message,
  //   model,
  //   webSearch,
  // }: {
  //   chatId: string;
  //   message: UIMessage;
  //   model: string;
  //   webSearch: boolean;
  // } = await req.json();

  // load the previous messages from the server:
  const previousMessages = await loadChat(id);

  // console.log("loaded previous messages from loadChat", previousMessages);

  // append the new message to the previous messages:

  const messages = [
    ...previousMessages,
    // {
    //   role: "user",
    //   content: `The Bot Name is ${botName} and the botId is ${botId}`,
    // },
    message,
  ];

  console.log("messages", messages);

  const result = streamText({
    model: googleAISDKProvider("gemini-2.5-flash"),
    system:
      buildBotSystemPrompt({
        botId,
        botName,
        instructions,
        tone,
        language,
        greeting,
        brandGuidelines,
      }) || "You are a helpful assistant.",
    messages: convertToModelMessages(messages),
    tools: {
      weatherTool,
      getInformation,
    },
    stopWhen: stepCountIs(5),
  });

  result.consumeStream();

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: createIdGenerator({
      prefix: "msg",
      size: 16,
    }),
    onFinish: ({ messages }) => {
      console.log("inside on Finish Callback", id);
      saveChat({ chatId: id, messages });
    },

    sendSources: true,
    sendReasoning: true,
  });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);

  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError(
      "bad_request:api",
      "Chat ID is required"
    ).toResponse();
  }

  const userSession = await auth();

  if (!userSession) {
    return new ChatSDKError("bad_request:auth", "Unauthorized").toResponse();
  }

  const chat = await getBotChatById({ id });

  if (!chat) {
    return new ChatSDKError("bad_request:api", "Chat not found").toResponse();
  }

  if (chat.userId !== userSession.user.id) {
    return new ChatSDKError("forbidden:chat").toResponse();
  }

  console.log("inside deleting bot chat");
  const deletedChat = await deleteBotChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
