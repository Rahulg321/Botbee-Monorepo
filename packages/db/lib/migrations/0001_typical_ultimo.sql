DO $$ BEGIN
 CREATE TYPE "public"."language" AS ENUM('en-gb', 'en-us');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bot" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"avatar" text NOT NULL,
	"greeting" text NOT NULL,
	"urls" text[] DEFAULT '{}' NOT NULL,
	"instructions" text NOT NULL,
	"bot_language" "language" DEFAULT 'en-gb' NOT NULL,
	"userId" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bot_resource_embeddings" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"bot_resource_id" uuid NOT NULL,
	"content" text,
	"embedding" vector(1536) NOT NULL,
	CONSTRAINT "bot_resource_embeddings_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bot_resources" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"bot_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"kind" varchar DEFAULT 'pdf' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bot_resources_id_pk" PRIMARY KEY("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bot" ADD CONSTRAINT "bot_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bot_resource_embeddings" ADD CONSTRAINT "bot_resource_embeddings_bot_resource_id_bot_resources_id_fk" FOREIGN KEY ("bot_resource_id") REFERENCES "public"."bot_resources"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bot_resources" ADD CONSTRAINT "bot_resources_bot_id_bot_id_fk" FOREIGN KEY ("bot_id") REFERENCES "public"."bot"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "bot_resource_embedding_index" ON "bot_resource_embeddings" USING hnsw ("embedding" vector_cosine_ops);