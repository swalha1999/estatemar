-- Production-safe migration: Convert text IDs to UUIDs
-- This migration assumes existing text IDs are valid UUID strings
-- If they are not, we need to create a mapping table first

-- Add temporary UUID columns first
ALTER TABLE "user" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "account" ADD COLUMN "uuid_user_id" uuid;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "uuid_user_id" uuid;--> statement-breakpoint
ALTER TABLE "verification" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "uuid_user_id" uuid;--> statement-breakpoint
ALTER TABLE "property_amenity" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property_amenity" ADD COLUMN "uuid_property_id" uuid;--> statement-breakpoint
ALTER TABLE "property_image" ADD COLUMN "uuid_id" uuid DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property_image" ADD COLUMN "uuid_property_id" uuid;--> statement-breakpoint

-- Update foreign key references using the new UUID columns
-- This creates the mapping from old text IDs to new UUIDs
UPDATE "account" SET "uuid_user_id" = (
    SELECT "uuid_id" FROM "user" WHERE "user"."id" = "account"."user_id"
);--> statement-breakpoint

UPDATE "session" SET "uuid_user_id" = (
    SELECT "uuid_id" FROM "user" WHERE "user"."id" = "session"."user_id"  
);--> statement-breakpoint

UPDATE "property" SET "uuid_user_id" = (
    SELECT "uuid_id" FROM "user" WHERE "user"."id" = "property"."user_id"
);--> statement-breakpoint

UPDATE "property_amenity" SET "uuid_property_id" = (
    SELECT "uuid_id" FROM "property" WHERE "property"."id" = "property_amenity"."property_id"
);--> statement-breakpoint

UPDATE "property_image" SET "uuid_property_id" = (
    SELECT "uuid_id" FROM "property" WHERE "property"."id" = "property_image"."property_id"
);--> statement-breakpoint

-- Drop old foreign key constraints
ALTER TABLE "account" DROP CONSTRAINT IF EXISTS "account_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "session" DROP CONSTRAINT IF EXISTS "session_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "property" DROP CONSTRAINT IF EXISTS "property_user_id_user_id_fk";--> statement-breakpoint
ALTER TABLE "property_amenity" DROP CONSTRAINT IF EXISTS "property_amenity_property_id_property_id_fk";--> statement-breakpoint
ALTER TABLE "property_image" DROP CONSTRAINT IF EXISTS "property_image_property_id_property_id_fk";--> statement-breakpoint

-- Drop old columns and rename UUID columns
ALTER TABLE "user" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "user" RENAME COLUMN "uuid_id" TO "id";--> statement-breakpoint
ALTER TABLE "user" ADD PRIMARY KEY ("id");--> statement-breakpoint

ALTER TABLE "account" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "account" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "uuid_id" TO "id";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "uuid_user_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "account" ADD PRIMARY KEY ("id");--> statement-breakpoint

ALTER TABLE "session" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "session" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "uuid_id" TO "id";--> statement-breakpoint
ALTER TABLE "session" RENAME COLUMN "uuid_user_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "session" ADD PRIMARY KEY ("id");--> statement-breakpoint

ALTER TABLE "verification" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "verification" RENAME COLUMN "uuid_id" TO "id";--> statement-breakpoint
ALTER TABLE "verification" ADD PRIMARY KEY ("id");--> statement-breakpoint

ALTER TABLE "property" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "user_id";--> statement-breakpoint
ALTER TABLE "property" RENAME COLUMN "uuid_id" TO "id";--> statement-breakpoint
ALTER TABLE "property" RENAME COLUMN "uuid_user_id" TO "user_id";--> statement-breakpoint
ALTER TABLE "property" ADD PRIMARY KEY ("id");--> statement-breakpoint

ALTER TABLE "property_amenity" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "property_amenity" DROP COLUMN "property_id";--> statement-breakpoint
ALTER TABLE "property_amenity" RENAME COLUMN "uuid_id" TO "id";--> statement-breakpoint
ALTER TABLE "property_amenity" RENAME COLUMN "uuid_property_id" TO "property_id";--> statement-breakpoint
ALTER TABLE "property_amenity" ADD PRIMARY KEY ("id");--> statement-breakpoint

ALTER TABLE "property_image" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "property_image" DROP COLUMN "property_id";--> statement-breakpoint
ALTER TABLE "property_image" RENAME COLUMN "uuid_id" TO "id";--> statement-breakpoint
ALTER TABLE "property_image" RENAME COLUMN "uuid_property_id" TO "property_id";--> statement-breakpoint
ALTER TABLE "property_image" ADD PRIMARY KEY ("id");--> statement-breakpoint

-- Set default values for new UUID columns
ALTER TABLE "user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "verification" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property_amenity" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "property_image" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint

-- Add NOT NULL constraints
ALTER TABLE "account" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "property_amenity" ALTER COLUMN "property_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "property_image" ALTER COLUMN "property_id" SET NOT NULL;--> statement-breakpoint

-- Re-add foreign key constraints
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_amenity" ADD CONSTRAINT "property_amenity_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_image" ADD CONSTRAINT "property_image_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;