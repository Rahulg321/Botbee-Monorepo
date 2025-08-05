import { z } from "zod";

export const newUrlFormSchema = z.object({
  url: z.string().url("Invalid URL format"),
  botId: z.string().min(1, "Bot is required"),
});
