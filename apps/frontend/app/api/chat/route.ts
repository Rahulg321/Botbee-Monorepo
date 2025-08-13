import { googleAISDKProvider } from "@/lib/ai/providers";
import { askForConfirmation } from "@/lib/ai/tools/ask-confirmation-tool";
import { weatherTool } from "@/lib/ai/tools/weather-tool";
import { loadChat, saveChat } from "@/lib/chat-store";
import {
  convertToModelMessages,
  createIdGenerator,
  stepCountIs,
  streamText,
  UIMessage,
} from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  console.log("body inside chat request", body);

  const { id, message, model, webSearch } = body;

  //@ts-ignore
  message.parts.map((e, index) => {
    console.log(`message ${index}`, e);
  });

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

  console.log("chatId inside route", id);

  // load the previous messages from the server:
  const previousMessages = await loadChat(id);

  // console.log("loaded previous messages from loadChat", previousMessages);

  // append the new message to the previous messages:
  const messages = [...previousMessages, message];

  const result = streamText({
    model: googleAISDKProvider("gemini-2.5-flash"),
    system: "You are a helpful assistant.",
    messages: convertToModelMessages(messages),
    tools: {
      weatherTool,
    },
    stopWhen: stepCountIs(5),
  });

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
