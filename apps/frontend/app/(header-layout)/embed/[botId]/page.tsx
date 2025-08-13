import React from "react";
import BotChat from "./bot-chat";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { createChat } from "@/lib/chat-store";

export const metadata = {
  title: "Bot Chat",
  description: "Bot Chat",
};

const page = async ({ params }: { params: Promise<{ botId: string }> }) => {
  const session = await auth();

  if (!session) {
    return notFound();
  }

  const botId = (await params).botId;

  const id = await createChat({
    userId: session.user.id,
    botId: botId,
  });

  redirect(`/embed/${botId}/${id}`);
};

export default page;
