"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, ToolUIPart, UIMessage } from "ai";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useState } from "react";
import { Response } from "@/components/ai-elements/response";
import { GlobeIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/source";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { toast } from "sonner";
import { Bot } from "@repo/db/schema";
import {
  GetInformationToolUIPart,
  GetInformationToolOutput,
  WeatherToolOutput,
  WeatherToolUIPart,
} from "@/lib/tool-types";
import {
  formatGetInformationResult,
  formatGetWeatherResult,
} from "@/components/tool-output-components";
import BotPromptForm from "./bot-prompt-form";
import { availableBotModels } from "@/lib/available-bot-models";

export default function BotChat({
  botId,
  chatId,
  bot,
  initialMessages,
}: {
  botId: string;
  bot: Bot;
  chatId?: string | undefined;
  initialMessages?: UIMessage[];
}) {
  console.log("insdie bot chat");

  const { messages, sendMessage, status } = useChat({
    id: chatId,
    experimental_throttle: 50,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest({ messages, id, body }) {
        return {
          body: {
            message: messages[messages.length - 1],
            id,
            ...body, // Merge any custom body data
          },
        };
      },
    }),

    onError: (error) => {
      console.error("An error occurred:", error);
      toast.error(`${error.name}:${error.cause ? error.cause : ""}`, {
        description: error.message,
      });
    },
    onData: (data) => {
      console.log("Received data part from server:", data);
    },
  });

  const latestMessage = messages[messages.length - 1];

  const weatherTool = latestMessage?.parts?.find(
    (part) => part.type === "tool-weatherTool"
  ) as WeatherToolUIPart | undefined;

  const getInformationTool = latestMessage?.parts?.find(
    (part) => part.type === "tool-getInformation"
  ) as GetInformationToolUIPart | undefined;

  return (
    <div className="relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <div key={message.id}>
                {message.role === "assistant" && (
                  <Sources>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "source-url":
                          return (
                            <>
                              <SourcesTrigger
                                count={
                                  message.parts.filter(
                                    (part) => part.type === "source-url"
                                  ).length
                                }
                              />
                              <SourcesContent key={`${message.id}-${i}`}>
                                <Source
                                  key={`${message.id}-${i}`}
                                  href={part.url}
                                  title={part.url}
                                />
                              </SourcesContent>
                            </>
                          );
                      }
                    })}
                  </Sources>
                )}
                <Message from={message.role} key={message.id}>
                  <MessageContent>
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <Response key={`${message.id}-${i}`}>
                              {part.text}
                            </Response>
                          );
                        case "reasoning":
                          return (
                            <Reasoning
                              key={`${message.id}-${i}`}
                              className="w-full"
                              isStreaming={status === "streaming"}
                            >
                              <ReasoningTrigger />
                              <ReasoningContent>{part.text}</ReasoningContent>
                            </Reasoning>
                          );
                        case "tool-getInformation":
                          return (
                            <Tool defaultOpen={true} key={`${message.id}-${i}`}>
                              <ToolHeader
                                type="tool-getInformation"
                                state={
                                  getInformationTool?.state as
                                    | "input-streaming"
                                    | "input-available"
                                    | "output-available"
                                    | "output-error"
                                }
                              />
                              <ToolContent>
                                <ToolInput input={getInformationTool?.input} />
                                <ToolOutput
                                  output={
                                    <Response>
                                      {getInformationTool?.output &&
                                        formatGetInformationResult(
                                          getInformationTool?.output as GetInformationToolOutput
                                        )}
                                    </Response>
                                  }
                                  errorText={getInformationTool?.errorText}
                                />
                              </ToolContent>
                            </Tool>
                          );
                        case "tool-weatherTool":
                          return (
                            <Tool defaultOpen={true} key={`${message.id}-${i}`}>
                              <ToolHeader
                                type="tool-weatherTool"
                                state={
                                  weatherTool?.state as
                                    | "input-streaming"
                                    | "input-available"
                                    | "output-available"
                                    | "output-error"
                                }
                              />
                              <ToolContent>
                                <ToolInput input={weatherTool?.input} />
                                <ToolOutput
                                  output={
                                    <Response>
                                      {weatherTool?.output &&
                                        formatGetWeatherResult(
                                          weatherTool?.output as WeatherToolOutput
                                        )}
                                    </Response>
                                  }
                                  errorText={weatherTool?.errorText}
                                />
                              </ToolContent>
                            </Tool>
                          );
                        default:
                          return null;
                      }
                    })}
                  </MessageContent>
                </Message>
              </div>
            ))}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <BotPromptForm
          bot={bot}
          botId={botId}
          chatId={chatId}
          onSendMessage={sendMessage}
          status={status}
        />
      </div>
    </div>
  );
}
