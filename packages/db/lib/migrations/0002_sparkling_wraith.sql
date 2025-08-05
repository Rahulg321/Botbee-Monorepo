ALTER TABLE "bot_resources" ADD COLUMN "file_size" text NOT NULL;--> statement-breakpoint
ALTER TABLE "bot_resources" ADD COLUMN "userId" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bot_resources" ADD CONSTRAINT "bot_resources_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
