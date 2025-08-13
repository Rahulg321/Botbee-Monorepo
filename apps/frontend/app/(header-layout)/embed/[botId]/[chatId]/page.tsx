import { loadChat } from "@/lib/chat-store";
import BotChat from "../bot-chat";

export default async function Page(props: {
  params: Promise<{ botId: string; chatId: string }>;
}) {
  const { botId, chatId } = await props.params;
  console.log("botId, chatId", { botId, chatId });

  const messages = await loadChat(chatId);
  return <BotChat botId={botId} chatId={chatId} initialMessages={messages} />;
}
