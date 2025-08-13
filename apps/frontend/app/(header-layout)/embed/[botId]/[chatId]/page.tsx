import { loadChat } from "@/lib/chat-store";
import BotChat from "../bot-chat";
import { redirect } from "next/navigation";
import { getBotChatById } from "@/lib/queries";

export default async function Page(props: {
  params: Promise<{ botId: string; chatId: string }>;
}) {
  const { botId, chatId } = await props.params;

  const chat = await getBotChatById({ id: chatId });

  if (!chat) {
    console.log("chat does not exist, redirecting to bot page");
    redirect(`/embed/${botId}`);
  }

  const messages = await loadChat(chatId);

  return <BotChat botId={botId} chatId={chatId} initialMessages={messages} />;
}
