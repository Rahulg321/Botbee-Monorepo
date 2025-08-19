import { tool } from "ai";
import { z } from "zod";
import { googleGenAIProvider } from "../providers";
import { addCitations } from "@/lib/utils";

/**
 * Search the web for information.
 * @returns The search results.
 */
export const webSearchTool = tool({
  description: `search the web for information. You can use this tool to search the web for information. Call this tool with the question. Use this tool whenever you want to search the web for information which you dont have with you to satisfy the user questions.`,
  inputSchema: z.object({
    question: z.string().describe("the users question"),
  }),
  execute: async ({ question }) => {
    console.log("inside web search tool, question is", question);

    const groundingTool = {
      googleSearch: {},
    };

    // Configure generation settings
    const config = {
      tools: [groundingTool],
    };

    const response = await googleGenAIProvider.models.generateContent({
      model: "gemini-2.5-flash",
      contents: question,
      config,
    });

    const modelResponse = response.text;
    const responseWithCitations = addCitations(response);

    console.log({ modelResponse, responseWithCitations });

    return {
      modelResponse,
      responseWithCitations,
    };
  },
});
