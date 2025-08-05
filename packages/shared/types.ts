export type Game = {
  id: string;
  title: string;
};

export type DataPart = { type: "append-message"; message: string };

export type BotWithDocumentsCount =
  | {
      id: string;
      name: string;
      documentCount: number;
    }[]
  | null;

export type BotDocument =
  | {
      id: string;
      botId: string;
      botName: string;
      fileName: string;
      fileType: string;
      fileSize: string;
      createdAt: Date;
    }[]
  | null;
