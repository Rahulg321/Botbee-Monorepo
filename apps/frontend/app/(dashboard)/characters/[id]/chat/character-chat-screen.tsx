"use client";

import React from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
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
import { DefaultChatTransport } from "ai";
import { AiCharacter } from "@repo/db/schema";
import AudioMessage from "./audio-message";

const models = [
  {
    name: "GPT 4o",
    value: "openai/gpt-4o",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1",
  },
];

const CharacterChatScreen = ({
  characterImageUrl,
  characterName,
  categoryName,
  description,
  fullDescription,
  personality,
  behaviorAndTone,
  conversationTone,
  systemPrompt,
  brandGuidelines,
  customGreeting,
  starterPrompts,
}: {
  characterImageUrl: string;
  characterName: string;
  categoryName: string;
  description: string;
  fullDescription: string;
  personality: string;
  behaviorAndTone: string;
  conversationTone: string;
  systemPrompt: string;
  brandGuidelines: string;
  customGreeting: string;
  starterPrompts: string[];
}) => {
  const [input, setInput] = useState("");

  const [model, setModel] = useState<string>(models[0]?.value || "");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/character-chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(
        { text: input },
        {
          body: {
            model: model,
            characterName: characterName,
            categoryName: categoryName,
            description: description,
            personality: personality,
            behaviorAndTone: behaviorAndTone,
            conversationTone: conversationTone,
            systemPrompt: systemPrompt,
            brandGuidelines: brandGuidelines,
            customGreeting: customGreeting,
            starterPrompts: starterPrompts,
            characterDescription: fullDescription,
          },
        }
      );
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Conversation className="flex-1 min-h-0 overflow-y-auto">
        <ConversationContent className="">
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
                        if (message.role === "assistant") {
                          return (
                            <AudioMessage
                              key={`${message.id}-${i}`}
                              messageText={part.text}
                              characterName={characterName}
                              characterImageUrl={characterImageUrl}
                            />
                          );
                        } else {
                          return (
                            <Response key={`${message.id}-${i}`} className="">
                              {part.text}
                            </Response>
                          );
                        }
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

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <PromptInput onSubmit={handleSubmit} className="p-4">
          <PromptInputTextarea
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />
          <PromptInputToolbar>
            <PromptInputTools></PromptInputTools>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default CharacterChatScreen;
