CREATE TABLE IF NOT EXISTS "bot_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"image_url" text,
	"avatar" text NOT NULL,
	"greeting" text NOT NULL,
	"tone" text DEFAULT 'professional' NOT NULL,
	"instructions" text NOT NULL,
	"brand_guidelines" text,
	"bot_language" "language" DEFAULT 'en-gb' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"userId" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bot_templates" ADD CONSTRAINT "bot_templates_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
