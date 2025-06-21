CREATE TABLE "contacts" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"middle_name" varchar(255),
	"previous_family_name" varchar(255),
	"birth_year" integer,
	"gender" varchar(20),
	"phone" varchar(255),
	"personal_number" integer,
	"family_id" integer,
	"approved" boolean DEFAULT false NOT NULL,
	"approved_at" timestamp with time zone,
	"concent_message_sent" boolean DEFAULT false NOT NULL,
	"concent_message_failed" boolean DEFAULT false NOT NULL,
	"contact_consent" boolean DEFAULT false NOT NULL,
	"contact_consent_at" timestamp with time zone,
	"opt_out" boolean DEFAULT false NOT NULL,
	"opt_out_at" timestamp with time zone,
	"household_id" integer,
	"approved_by" integer,
	"added_by" integer
);
--> statement-breakpoint
CREATE TABLE "email_verification_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "families" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"uploaded_by" integer,
	"uploaded_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "households" (
	"id" serial PRIMARY KEY NOT NULL,
	"number" integer NOT NULL,
	"street" varchar(255) NOT NULL,
	"town" varchar(255) NOT NULL,
	CONSTRAINT "number_street_town_unique" UNIQUE("number","street","town")
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" serial PRIMARY KEY NOT NULL,
	"groom_name" varchar(255) NOT NULL,
	"bride_name" varchar(255) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"location" varchar(255) NOT NULL,
	"inviter" varchar(255),
	"whatsapp_template" varchar(255) NOT NULL,
	"wedding_card_file_id" integer,
	"user_id" integer,
	"admin_approved" boolean DEFAULT false NOT NULL,
	"is_canceled" boolean DEFAULT false NOT NULL,
	"scheduled_send_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"bride_name" varchar(255) NOT NULL,
	"groom_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_reset_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"code" varchar(255) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"is_admin" boolean DEFAULT false NOT NULL,
	"is_super_admin" boolean DEFAULT false NOT NULL,
	"is_developer" boolean DEFAULT false NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"phone" varchar(255),
	"password_hash" varchar(255),
	"recovery_code" varchar(255),
	"totp_key" varchar(255),
	"email_verified" boolean DEFAULT false NOT NULL,
	"registered_2fa" boolean DEFAULT false NOT NULL,
	"google_id" varchar(255),
	"photo_url" varchar(255),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_google_id_unique" UNIQUE("google_id")
);
--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message_id" varchar(255),
	"message_sent" boolean DEFAULT false NOT NULL,
	"message_delivered" boolean DEFAULT false NOT NULL,
	"message_read" boolean DEFAULT false NOT NULL,
	"message_failed" boolean DEFAULT false,
	"message_template" varchar(255),
	"approved" boolean DEFAULT false NOT NULL,
	"declined" boolean DEFAULT false NOT NULL,
	"phone" varchar(255),
	"message_content" text,
	"contact_id" integer,
	"invite_id" integer,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_family_id_families_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."families"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_added_by_users_id_fk" FOREIGN KEY ("added_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_verification_requests" ADD CONSTRAINT "email_verification_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_users_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_wedding_card_file_id_files_id_fk" FOREIGN KEY ("wedding_card_file_id") REFERENCES "public"."files"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invites" ADD CONSTRAINT "invites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password_reset_sessions" ADD CONSTRAINT "password_reset_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_invite_id_invites_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."invites"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "opt_out_index" ON "contacts" USING btree ("opt_out");--> statement-breakpoint
CREATE INDEX "phone_index" ON "contacts" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "approved_index" ON "contacts" USING btree ("approved");--> statement-breakpoint
CREATE INDEX "first_name_index" ON "contacts" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX "middle_name_index" ON "contacts" USING btree ("middle_name");--> statement-breakpoint
CREATE INDEX "previous_family_name_index" ON "contacts" USING btree ("previous_family_name");--> statement-breakpoint
CREATE INDEX "birth_year_index" ON "contacts" USING btree ("birth_year");--> statement-breakpoint
CREATE INDEX "gender_index" ON "contacts" USING btree ("gender");--> statement-breakpoint
CREATE INDEX "personal_number_index" ON "contacts" USING btree ("personal_number");--> statement-breakpoint
CREATE INDEX "household_id_index" ON "contacts" USING btree ("household_id");--> statement-breakpoint
CREATE INDEX "family_id_index" ON "contacts" USING btree ("family_id");--> statement-breakpoint
CREATE INDEX "household_personal_number_index" ON "contacts" USING btree ("household_id","personal_number");--> statement-breakpoint
CREATE INDEX "consent_status_index" ON "contacts" USING btree ("contact_consent","opt_out","concent_message_sent","concent_message_failed");--> statement-breakpoint
CREATE INDEX "name_index" ON "families" USING btree ("name");--> statement-breakpoint
CREATE INDEX "number_index" ON "households" USING btree ("number");--> statement-breakpoint
CREATE INDEX "street_index" ON "households" USING btree ("street");--> statement-breakpoint
CREATE INDEX "town_index" ON "households" USING btree ("town");--> statement-breakpoint
CREATE INDEX "email_index" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "username_index" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "google_id_index" ON "users" USING btree ("google_id");--> statement-breakpoint
CREATE INDEX "message_sent_index" ON "whatsapp_messages" USING btree ("message_sent");--> statement-breakpoint
CREATE INDEX "message_delivered_index" ON "whatsapp_messages" USING btree ("message_delivered");--> statement-breakpoint
CREATE INDEX "message_read_index" ON "whatsapp_messages" USING btree ("message_read");--> statement-breakpoint
CREATE INDEX "message_failed_index" ON "whatsapp_messages" USING btree ("message_failed");--> statement-breakpoint
CREATE INDEX "message_template_index" ON "whatsapp_messages" USING btree ("message_template");--> statement-breakpoint
CREATE INDEX "contact_id_index" ON "whatsapp_messages" USING btree ("contact_id");--> statement-breakpoint
CREATE INDEX "invite_id_index" ON "whatsapp_messages" USING btree ("invite_id");--> statement-breakpoint
CREATE INDEX "contact_invite_index" ON "whatsapp_messages" USING btree ("contact_id","invite_id");--> statement-breakpoint
CREATE INDEX "contact_invite_template_index" ON "whatsapp_messages" USING btree ("contact_id","message_template");--> statement-breakpoint
CREATE INDEX "invite_message_template_index" ON "whatsapp_messages" USING btree ("invite_id","message_template");--> statement-breakpoint
CREATE INDEX "contact_invite_message_id_index" ON "whatsapp_messages" USING btree ("contact_id","invite_id","message_id");