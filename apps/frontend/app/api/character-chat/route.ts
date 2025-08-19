import { buildCharacterSystemPrompt } from "@/lib/ai/prompts";
import { googleAISDKProvider } from "@/lib/ai/providers";
import { webSearchTool } from "@/lib/ai/tools/web-search-tool";
import { streamText, UIMessage, convertToModelMessages, stepCountIs } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const {
    messages,
    model,
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
    messages: UIMessage[];
    model: string;
    fullDescription: string;
    characterName: string;
    categoryName: string;
    description: string;
    personality: string;
    behaviorAndTone: string;
    conversationTone: string;
    systemPrompt: string;
    brandGuidelines: string;
    customGreeting: string;
    starterPrompts: string[];
  } = await req.json();

  console.log("insdie character-chat");

  const result = streamText({
    model: googleAISDKProvider("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    tools: { webSearchTool },
    stopWhen: stepCountIs(5),
    system: buildCharacterSystemPrompt({
      characterName: characterName,
      category: categoryName,
      description: description,
      fullDescription: fullDescription,
      personality: personality,
      behaviorAndTone: behaviorAndTone,
      conversationTone: conversationTone,
      systemPrompt: systemPrompt,
      brandGuidelines: brandGuidelines,
      customGreeting: customGreeting,
      starterPrompts: starterPrompts,
    }),
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
