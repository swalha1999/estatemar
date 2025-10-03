CREATE TYPE "public"."amenity_type" AS ENUM('pool', 'gym', 'parking', 'security', 'garden', 'playground', 'elevator', 'balcony', 'maid_room', 'storage', 'study_room', 'laundry', 'central_ac', 'built_in_wardrobes', 'kitchen_appliances', 'internet', 'satellite_cable_tv', 'intercom', 'maintenance', 'cleaning_services', 'concierge', 'spa', 'tennis_court', 'basketball_court', 'jogging_track', 'bbq_area', 'kids_play_area', 'mosque', 'shopping_center', 'restaurants', 'cafes', 'medical_center', 'schools', 'beach_access');--> statement-breakpoint
CREATE TYPE "public"."construction_status" AS ENUM('planning', 'foundation', 'structure', 'finishing', 'completed', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."furnishing" AS ENUM('unfurnished', 'semi_furnished', 'fully_furnished');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('rent', 'buy', 'track');--> statement-breakpoint
CREATE TYPE "public"."property_status" AS ENUM('under_construction', 'ready', 'off_plan', 'resale');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('apartment', 'villa', 'house', 'townhouse', 'penthouse', 'studio', 'duplex', 'compound', 'office', 'retail', 'warehouse', 'land', 'commercial', 'industrial');--> statement-breakpoint
CREATE TYPE "public"."view_type" AS ENUM('sea', 'city', 'garden', 'pool', 'golf', 'mountain', 'marina', 'park', 'street');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"active_organization_id" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"phone_number" text,
	"phone_number_verified" boolean,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"property_type" "property_type" NOT NULL,
	"listing_type" "listing_type" NOT NULL,
	"property_status" "property_status" NOT NULL,
	"construction_status" "construction_status",
	"expected_completion_date" timestamp,
	"handover_date" timestamp,
	"developer_name" text,
	"project_name" text,
	"country" text NOT NULL,
	"city" text NOT NULL,
	"area" text NOT NULL,
	"sub_area" text,
	"building" text,
	"street_address" text,
	"landmark" text,
	"latitude" real,
	"longitude" real,
	"bedrooms" integer,
	"bathrooms" integer,
	"size" real,
	"plot_size" real,
	"built_up_area" real,
	"floor" integer,
	"total_floors" integer,
	"parking_spaces" integer DEFAULT 0,
	"furnishing" "furnishing" DEFAULT 'unfurnished',
	"year_built" integer,
	"price" numeric(15, 2) NOT NULL,
	"currency" text NOT NULL,
	"price_per_sqm" numeric(10, 2),
	"rent_frequency" text,
	"security_deposit" numeric(15, 2),
	"commission_percentage" real,
	"down_payment" numeric(15, 2),
	"mortgage_available" boolean DEFAULT false,
	"purchase_price" numeric(15, 2),
	"purchase_date" timestamp,
	"current_mortgage_balance" numeric(15, 2),
	"monthly_mortgage_payment" numeric(10, 2),
	"mortgage_interest_rate" real,
	"mortgage_start_date" timestamp,
	"mortgage_end_date" timestamp,
	"lender_name" text,
	"ownership_percentage" real DEFAULT 100,
	"co_owners" jsonb,
	"total_investment" numeric(15, 2),
	"improvement_costs" numeric(15, 2),
	"improvement_history" jsonb,
	"current_rental_income" numeric(10, 2),
	"rental_income_frequency" text,
	"tenant_details" jsonb,
	"lease_start_date" timestamp,
	"lease_end_date" timestamp,
	"annual_property_tax" numeric(10, 2),
	"annual_insurance" numeric(10, 2),
	"annual_maintenance_cost" numeric(10, 2),
	"other_annual_expenses" numeric(10, 2),
	"equity_value" numeric(15, 2),
	"total_return" real,
	"annualized_return" real,
	"net_cash_flow" numeric(10, 2),
	"last_valuation_date" timestamp,
	"last_valuation_amount" numeric(15, 2),
	"valuation_source" text,
	"next_valuation_date" timestamp,
	"tracking_enabled" boolean DEFAULT true,
	"notification_preferences" jsonb,
	"portfolio_category" text,
	"service_charge" numeric(10, 2),
	"service_charge_frequency" text,
	"maintenance_fee" numeric(10, 2),
	"property_age" integer,
	"last_renovated" integer,
	"condition" text,
	"market_value" numeric(15, 2),
	"price_history" jsonb,
	"similar_properties_avg_price" numeric(15, 2),
	"area_avg_price_per_sqm" numeric(10, 2),
	"rent_yield" real,
	"cap_rate" real,
	"price_appreciation" real,
	"demand_score" integer,
	"supply_score" integer,
	"walkability_score" integer,
	"transport_score" integer,
	"schools_score" integer,
	"shopping_score" integer,
	"hospital_score" integer,
	"distance_to_downtown" real,
	"distance_to_airport" real,
	"distance_to_beach" real,
	"distance_to_mall" real,
	"distance_to_school" real,
	"distance_to_hospital" real,
	"distance_to_metro" real,
	"building_age" integer,
	"total_units_in_building" integer,
	"building_rating" real,
	"images" jsonb,
	"virtual_tour_url" text,
	"floor_plan" text,
	"is_active" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"is_premium" boolean DEFAULT false,
	"views" integer DEFAULT 0,
	"inquiries" integer DEFAULT 0,
	"slug" text,
	"meta_title" text,
	"meta_description" text,
	"tags" jsonb,
	"organization_id" text,
	"user_id" text,
	"agent_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"expires_at" timestamp,
	CONSTRAINT "property_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "property_amenity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"amenity_type" "amenity_type" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_analytics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"views" integer DEFAULT 0,
	"inquiries" integer DEFAULT 0,
	"favorites" integer DEFAULT 0,
	"shares" integer DEFAULT 0,
	"phone_clicks" integer DEFAULT 0,
	"email_clicks" integer DEFAULT 0,
	"virtual_tour_views" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_favorite" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_inquiry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"user_id" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text,
	"inquiry_type" text NOT NULL,
	"preferred_contact_method" text,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_portfolio_metrics" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"organization_id" text,
	"metric_date" timestamp NOT NULL,
	"current_value" numeric(15, 2) NOT NULL,
	"equity_value" numeric(15, 2),
	"total_return" real,
	"annualized_return" real,
	"monthly_rental_income" numeric(10, 2),
	"monthly_expenses" numeric(10, 2),
	"net_cash_flow" numeric(10, 2),
	"area_appreciation" real,
	"outperformance_ratio" real,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_valuation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"valuation_amount" numeric(15, 2) NOT NULL,
	"valuation_date" timestamp NOT NULL,
	"valuation_source" text NOT NULL,
	"valuation_method" text,
	"confidence" real,
	"comparable_properties" jsonb,
	"market_conditions" jsonb,
	"adjustments" jsonb,
	"notes" text,
	"valuer_id" text,
	"valuation_company" text,
	"certification_number" text,
	"previous_valuation" numeric(15, 2),
	"change_amount" numeric(15, 2),
	"change_percentage" real,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_view" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"view_type" "view_type" NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_agent_id_user_id_fk" FOREIGN KEY ("agent_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_amenity" ADD CONSTRAINT "property_amenity_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_analytics" ADD CONSTRAINT "property_analytics_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_favorite" ADD CONSTRAINT "property_favorite_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_favorite" ADD CONSTRAINT "property_favorite_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_inquiry" ADD CONSTRAINT "property_inquiry_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_inquiry" ADD CONSTRAINT "property_inquiry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_portfolio_metrics" ADD CONSTRAINT "property_portfolio_metrics_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_portfolio_metrics" ADD CONSTRAINT "property_portfolio_metrics_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_portfolio_metrics" ADD CONSTRAINT "property_portfolio_metrics_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_valuation" ADD CONSTRAINT "property_valuation_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_valuation" ADD CONSTRAINT "property_valuation_valuer_id_user_id_fk" FOREIGN KEY ("valuer_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_view" ADD CONSTRAINT "property_view_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "property_property_type_idx" ON "property" USING btree ("property_type");--> statement-breakpoint
CREATE INDEX "property_listing_type_idx" ON "property" USING btree ("listing_type");--> statement-breakpoint
CREATE INDEX "property_property_status_idx" ON "property" USING btree ("property_status");--> statement-breakpoint
CREATE INDEX "property_city_idx" ON "property" USING btree ("city");--> statement-breakpoint
CREATE INDEX "property_area_idx" ON "property" USING btree ("area");--> statement-breakpoint
CREATE INDEX "property_price_idx" ON "property" USING btree ("price");--> statement-breakpoint
CREATE INDEX "property_bedrooms_idx" ON "property" USING btree ("bedrooms");--> statement-breakpoint
CREATE INDEX "property_size_idx" ON "property" USING btree ("size");--> statement-breakpoint
CREATE INDEX "property_is_active_idx" ON "property" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "property_created_at_idx" ON "property" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "property_organization_id_idx" ON "property" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "property_user_id_idx" ON "property" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "property_agent_id_idx" ON "property" USING btree ("agent_id");--> statement-breakpoint
CREATE INDEX "property_type_listing_city_idx" ON "property" USING btree ("property_type","listing_type","city");--> statement-breakpoint
CREATE INDEX "property_city_area_price_idx" ON "property" USING btree ("city","area","price");--> statement-breakpoint
CREATE INDEX "property_bedrooms_price_idx" ON "property" USING btree ("bedrooms","price");--> statement-breakpoint
CREATE INDEX "property_active_published_idx" ON "property" USING btree ("is_active","published_at");--> statement-breakpoint
CREATE INDEX "property_org_active_idx" ON "property" USING btree ("organization_id","is_active");--> statement-breakpoint
CREATE INDEX "property_location_idx" ON "property" USING btree ("latitude","longitude");--> statement-breakpoint
CREATE INDEX "property_slug_idx" ON "property" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "property_featured_idx" ON "property" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "property_premium_idx" ON "property" USING btree ("is_premium");--> statement-breakpoint
CREATE INDEX "property_purchase_date_idx" ON "property" USING btree ("purchase_date");--> statement-breakpoint
CREATE INDEX "property_portfolio_category_idx" ON "property" USING btree ("portfolio_category");--> statement-breakpoint
CREATE INDEX "property_tracking_enabled_idx" ON "property" USING btree ("tracking_enabled");--> statement-breakpoint
CREATE INDEX "property_last_valuation_date_idx" ON "property" USING btree ("last_valuation_date");--> statement-breakpoint
CREATE INDEX "property_user_portfolio_idx" ON "property" USING btree ("user_id","portfolio_category");--> statement-breakpoint
CREATE INDEX "property_org_portfolio_idx" ON "property" USING btree ("organization_id","portfolio_category");--> statement-breakpoint
CREATE UNIQUE INDEX "property_amenity_unique" ON "property_amenity" USING btree ("property_id","amenity_type");--> statement-breakpoint
CREATE INDEX "property_amenity_property_id_idx" ON "property_amenity" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_amenity_type_idx" ON "property_amenity" USING btree ("amenity_type");--> statement-breakpoint
CREATE UNIQUE INDEX "property_analytics_unique" ON "property_analytics" USING btree ("property_id","date");--> statement-breakpoint
CREATE INDEX "property_analytics_property_id_idx" ON "property_analytics" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_analytics_date_idx" ON "property_analytics" USING btree ("date");--> statement-breakpoint
CREATE INDEX "property_analytics_views_idx" ON "property_analytics" USING btree ("views");--> statement-breakpoint
CREATE UNIQUE INDEX "property_favorite_unique" ON "property_favorite" USING btree ("property_id","user_id");--> statement-breakpoint
CREATE INDEX "property_favorite_property_id_idx" ON "property_favorite" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_favorite_user_id_idx" ON "property_favorite" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "property_favorite_created_at_idx" ON "property_favorite" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "property_inquiry_property_id_idx" ON "property_inquiry" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_inquiry_user_id_idx" ON "property_inquiry" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "property_inquiry_status_idx" ON "property_inquiry" USING btree ("status");--> statement-breakpoint
CREATE INDEX "property_inquiry_created_at_idx" ON "property_inquiry" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "property_inquiry_email_idx" ON "property_inquiry" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "property_portfolio_metrics_unique" ON "property_portfolio_metrics" USING btree ("property_id","metric_date");--> statement-breakpoint
CREATE INDEX "property_portfolio_metrics_property_id_idx" ON "property_portfolio_metrics" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_portfolio_metrics_user_id_idx" ON "property_portfolio_metrics" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "property_portfolio_metrics_org_id_idx" ON "property_portfolio_metrics" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "property_portfolio_metrics_date_idx" ON "property_portfolio_metrics" USING btree ("metric_date");--> statement-breakpoint
CREATE INDEX "property_portfolio_metrics_user_date_idx" ON "property_portfolio_metrics" USING btree ("user_id","metric_date");--> statement-breakpoint
CREATE INDEX "property_valuation_property_id_idx" ON "property_valuation" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_valuation_date_idx" ON "property_valuation" USING btree ("valuation_date");--> statement-breakpoint
CREATE INDEX "property_valuation_source_idx" ON "property_valuation" USING btree ("valuation_source");--> statement-breakpoint
CREATE INDEX "property_valuation_amount_idx" ON "property_valuation" USING btree ("valuation_amount");--> statement-breakpoint
CREATE INDEX "property_valuation_property_date_idx" ON "property_valuation" USING btree ("property_id","valuation_date");--> statement-breakpoint
CREATE INDEX "property_valuation_valuer_id_idx" ON "property_valuation" USING btree ("valuer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "property_view_unique" ON "property_view" USING btree ("property_id","view_type");--> statement-breakpoint
CREATE INDEX "property_view_property_id_idx" ON "property_view" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "property_view_type_idx" ON "property_view" USING btree ("view_type");