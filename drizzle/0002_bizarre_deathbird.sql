ALTER TABLE "batch" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "updated_at" timestamp;--> statement-breakpoint
ALTER TABLE "batch" ADD COLUMN "deleted_at" timestamp;