import { z } from "zod";
import { UIMessage } from "ai";

export const postRequestBodySchema = z.object({
  id: z.string(),
  message: z.any(),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
