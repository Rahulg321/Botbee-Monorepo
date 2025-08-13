ALTER TABLE "bot_chat_messages" ADD COLUMN "message_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bot_chat_messages" ADD COLUMN "parts" json NOT NULL;--> statement-breakpoint
ALTER TABLE "bot_chat_messages" ADD COLUMN "metadata" json;