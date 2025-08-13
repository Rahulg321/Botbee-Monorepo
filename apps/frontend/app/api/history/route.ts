import type { NextRequest } from "next/server";
import { ChatSDKError } from "@/lib/errors";
import { auth } from "@/auth";
import { getBotChatsByUserId } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  console.log("inside history route", searchParams);

  const limit = Number.parseInt(searchParams.get("limit") || "10");
  const startingAfter = searchParams.get("starting_after");
  const endingBefore = searchParams.get("ending_before");

  if (startingAfter && endingBefore) {
    return new ChatSDKError(
      "bad_request:api",
      "Only one of starting_after or ending_before can be provided."
    ).toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const chats = await getBotChatsByUserId({
    id: session.user.id as string,
    limit,
    startingAfter,
    endingBefore,
  });

  return Response.json(chats);
}
