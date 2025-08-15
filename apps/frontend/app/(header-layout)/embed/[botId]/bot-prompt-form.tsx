"use client";

import React, { useState } from "react";
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
import { availableBotModels } from "@/lib/available-bot-models";
import { Bot } from "@repo/db/schema";
import { GlobeIcon } from "lucide-react";
import { ChatStatus } from "ai";

const BotPromptForm = ({
  bot,
  botId,
  chatId,
  onSendMessage,
  status,
}: {
  // Add prop types here
  bot: Bot;
  botId: string;
  chatId?: string;
  onSendMessage: (message: { text: string }, options: any) => void;
  status: ChatStatus;
}) => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(
    availableBotModels[0]?.value || ""
  );
  const [webSearch, setWebSearch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(
        { text: input },
        {
          body: {
            customKey: "customValue",
            botId: botId,
            chatId: chatId,
            botName: bot.name,
            language: bot.botLanguage,
            greeting: bot.greeting,
            instructions: bot.instructions,
            tone: bot.tone,
            brandGuidelines: bot.brandGuidelines,
          },
        }
      );
      setInput("");
    }
  };

  return (
    <PromptInput onSubmit={handleSubmit} className="mt-4">
      <PromptInputTextarea
        onChange={(e) => setInput(e.target.value)}
        value={input}
      />
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputButton
            variant={webSearch ? "default" : "ghost"}
            onClick={() => setWebSearch(!webSearch)}
          >
            <GlobeIcon size={16} />
            <span>Search</span>
          </PromptInputButton>
          <PromptInputModelSelect
            onValueChange={(value) => {
              setModel(value);
            }}
            value={model}
          >
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {availableBotModels.map((model) => (
                <PromptInputModelSelectItem
                  key={model.value}
                  value={model.value}
                >
                  {model.name}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
        </PromptInputTools>
        <PromptInputSubmit disabled={!input} status={status as ChatStatus} />
      </PromptInputToolbar>
    </PromptInput>
  );
};

export default BotPromptForm;
