import { loadChat } from "@/lib/chat-store";
import BotChat from "../bot-chat";
import { notFound, redirect } from "next/navigation";
import { getBotById, getBotChatById } from "@/lib/queries";

export default async function Page(props: {
  params: Promise<{ botId: string; chatId: string }>;
}) {
  const { botId, chatId } = await props.params;

  const chat = await getBotChatById({ id: chatId });

  if (!chat) {
    console.log("chat does not exist, redirecting to bot page");
    redirect(`/embed/${botId}`);
  }

  const bot = await getBotById(botId);

  if (!bot) {
    return notFound();
  }

  const messages = await loadChat(chatId);

  return (
    <div>
      <BotChat
        botId={botId}
        chatId={chatId}
        bot={bot}
        initialMessages={messages}
      />
    </div>
  );
}
