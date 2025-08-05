import { getBotById } from "@/lib/queries";
import React from "react";

const SpecificBotPage = async ({
  params,
}: {
  params: Promise<{ botId: string }>;
}) => {
  const { botId } = await params;

  const bot = await getBotById(botId);

  return <div>{bot?.name}</div>;
};

export default SpecificBotPage;
