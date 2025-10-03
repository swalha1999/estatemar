import {
	boolean,
	decimal,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	real,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";
import { organization, user } from "./auth";

// Enums for property types and statuses
export const propertyTypeEnum = pgEnum("property_type", [
	"apartment",
	"villa",
	"house",
	"townhouse",
	"penthouse",
	"studio",
	"duplex",
	"compound",
	"office",
	"retail",
	"warehouse",
	"land",
	"commercial",
	"industrial",
]);

export const listingTypeEnum = pgEnum("listing_type", ["rent", "buy", "track"]);

export const propertyStatusEnum = pgEnum("property_status", [
	"under_construction",
	"ready",
	"off_plan",
	"resale",
]);

export const constructionStatusEnum = pgEnum("construction_status", [
	"planning",
	"foundation",
	"structure",
	"finishing",
	"completed",
	"delivered",
]);

export const furnishingEnum = pgEnum("furnishing", [
	"unfurnished",
	"semi_furnished",
	"fully_furnished",
]);

export const viewTypeEnum = pgEnum("view_type", [
	"sea",
	"city",
	"garden",
	"pool",
	"golf",
	"mountain",
	"marina",
	"park",
	"street",
]);

export const amenityTypeEnum = pgEnum("amenity_type", [
	"pool",
	"gym",
	"parking",
	"security",
	"garden",
	"playground",
	"elevator",
	"balcony",
	"maid_room",
	"storage",
	"study_room",
	"laundry",
	"central_ac",
	"built_in_wardrobes",
	"kitchen_appliances",
	"internet",
	"satellite_cable_tv",
	"intercom",
	"maintenance",
	"cleaning_services",
	"concierge",
	"spa",
	"tennis_court",
	"basketball_court",
	"jogging_track",
	"bbq_area",
	"kids_play_area",
	"mosque",
	"shopping_center",
	"restaurants",
	"cafes",
	"medical_center",
	"schools",
	"beach_access",
]);

// Main property table
export const property = pgTable(
	"property",
	{
		id: uuid("id").primaryKey().defaultRandom(),

		// Basic property information
		title: text("title").notNull(),
		description: text("description"),
		propertyType: propertyTypeEnum("property_type").notNull(),
		listingType: listingTypeEnum("listing_type").notNull(),
		propertyStatus: propertyStatusEnum("property_status").notNull(),

		// Construction details (for under construction projects)
		constructionStatus: constructionStatusEnum("construction_status"),
		expectedCompletionDate: timestamp("expected_completion_date"),
		handoverDate: timestamp("handover_date"),
		developerName: text("developer_name"),
		projectName: text("project_name"),

		// Location details
		country: text("country").notNull(),
		city: text("city").notNull(),
		area: text("area").notNull(),
		subArea: text("sub_area"),
		building: text("building"),
		streetAddress: text("street_address"),
		landmark: text("landmark"),
		latitude: real("latitude"),
		longitude: real("longitude"),

		// Property specifications
		bedrooms: integer("bedrooms"),
		bathrooms: integer("bathrooms"),
		size: real("size"), // in sqm (square meters)
		plotSize: real("plot_size"), // in sqm for villas/houses
		builtUpArea: real("built_up_area"), // in sqm
		floor: integer("floor"),
		totalFloors: integer("total_floors"),
		parkingSpaces: integer("parking_spaces").default(0),

		// Property features
		furnishing: furnishingEnum("furnishing").default("unfurnished"),
		yearBuilt: integer("year_built"),

		// Pricing information
		price: decimal("price", { precision: 15, scale: 2 }).notNull(),
		currency: text("currency").notNull(),
		pricePerSqm: decimal("price_per_sqm", { precision: 10, scale: 2 }),

		// Rental specific fields
		rentFrequency: text("rent_frequency"), // "monthly", "yearly", "weekly"
		securityDeposit: decimal("security_deposit", { precision: 15, scale: 2 }),
		commissionPercentage: real("commission_percentage"),

		// Purchase specific fields
		downPayment: decimal("down_payment", { precision: 15, scale: 2 }),
		mortgageAvailable: boolean("mortgage_available").default(false),

		// Portfolio tracking specific fields (for listingType: "track")
		purchasePrice: decimal("purchase_price", { precision: 15, scale: 2 }),
		purchaseDate: timestamp("purchase_date"),
		currentMortgageBalance: decimal("current_mortgage_balance", {
			precision: 15,
			scale: 2,
		}),
		monthlyMortgagePayment: decimal("monthly_mortgage_payment", {
			precision: 10,
			scale: 2,
		}),
		mortgageInterestRate: real("mortgage_interest_rate"), // percentage
		mortgageStartDate: timestamp("mortgage_start_date"),
		mortgageEndDate: timestamp("mortgage_end_date"),
		lenderName: text("lender_name"),

		// Property ownership details
		ownershipPercentage: real("ownership_percentage").default(100), // percentage owned
		coOwners: jsonb("co_owners"), // Array of co-owner details

		// Investment tracking
		totalInvestment: decimal("total_investment", { precision: 15, scale: 2 }), // purchase + improvements
		improvementCosts: decimal("improvement_costs", { precision: 15, scale: 2 }),
		improvementHistory: jsonb("improvement_history"), // Array of improvements with dates and costs

		// Rental income tracking (for investment properties)
		currentRentalIncome: decimal("current_rental_income", {
			precision: 10,
			scale: 2,
		}),
		rentalIncomeFrequency: text("rental_income_frequency"), // "monthly", "yearly"
		tenantDetails: jsonb("tenant_details"), // Current tenant information
		leaseStartDate: timestamp("lease_start_date"),
		leaseEndDate: timestamp("lease_end_date"),

		// Property expenses tracking
		annualPropertyTax: decimal("annual_property_tax", {
			precision: 10,
			scale: 2,
		}),
		annualInsurance: decimal("annual_insurance", { precision: 10, scale: 2 }),
		annualMaintenanceCost: decimal("annual_maintenance_cost", {
			precision: 10,
			scale: 2,
		}),
		otherAnnualExpenses: decimal("other_annual_expenses", {
			precision: 10,
			scale: 2,
		}),

		// Portfolio analytics
		equityValue: decimal("equity_value", { precision: 15, scale: 2 }), // current value - mortgage balance
		totalReturn: real("total_return"), // percentage return since purchase
		annualizedReturn: real("annualized_return"), // yearly return percentage
		netCashFlow: decimal("net_cash_flow", { precision: 10, scale: 2 }), // monthly net income

		// Automated valuation tracking
		lastValuationDate: timestamp("last_valuation_date"),
		lastValuationAmount: decimal("last_valuation_amount", {
			precision: 15,
			scale: 2,
		}),
		valuationSource: text("valuation_source"), // "automated", "professional", "user_estimate"
		nextValuationDate: timestamp("next_valuation_date"),

		// Property tracking preferences
		trackingEnabled: boolean("tracking_enabled").default(true),
		notificationPreferences: jsonb("notification_preferences"), // alerts for value changes, market updates
		portfolioCategory: text("portfolio_category"), // "primary_residence", "investment", "vacation_home"

		// Service charges and fees
		serviceCharge: decimal("service_charge", { precision: 10, scale: 2 }),
		serviceChargeFrequency: text("service_charge_frequency"), // "monthly", "yearly"
		maintenanceFee: decimal("maintenance_fee", { precision: 10, scale: 2 }),

		// Property condition and age
		propertyAge: integer("property_age"), // in years
		lastRenovated: integer("last_renovated"), // year
		condition: text("condition"), // "excellent", "good", "fair", "needs_renovation"

		// Market data for AI training
		marketValue: decimal("market_value", { precision: 15, scale: 2 }),
		priceHistory: jsonb("price_history"), // Array of {date, price, event_type}
		similarPropertiesAvgPrice: decimal("similar_properties_avg_price", {
			precision: 15,
			scale: 2,
		}),
		areaAvgPricePerSqm: decimal("area_avg_price_per_sqm", {
			precision: 10,
			scale: 2,
		}),

		// Economic indicators for AI
		rentYield: real("rent_yield"), // for buy properties
		capRate: real("cap_rate"), // capitalization rate
		priceAppreciation: real("price_appreciation"), // yearly %
		demandScore: integer("demand_score"), // 1-10 scale
		supplyScore: integer("supply_score"), // 1-10 scale

		// Location scoring for AI
		walkabilityScore: integer("walkability_score"), // 1-100
		transportScore: integer("transport_score"), // 1-100
		schoolsScore: integer("schools_score"), // 1-100
		shoppingScore: integer("shopping_score"), // 1-100
		hospitalScore: integer("hospital_score"), // 1-100

		// Distance to key locations (in km)
		distanceToDowntown: real("distance_to_downtown"),
		distanceToAirport: real("distance_to_airport"),
		distanceToBeach: real("distance_to_beach"),
		distanceToMall: real("distance_to_mall"),
		distanceToSchool: real("distance_to_school"),
		distanceToHospital: real("distance_to_hospital"),
		distanceToMetro: real("distance_to_metro"),

		// Building information
		buildingAge: integer("building_age"),
		totalUnitsInBuilding: integer("total_units_in_building"),
		buildingRating: real("building_rating"), // 1-5 stars

		// Images and media
		images: jsonb("images"), // Array of image URLs
		virtualTourUrl: text("virtual_tour_url"),
		floorPlan: text("floor_plan"),

		// Listing management
		isActive: boolean("is_active").default(true),
		isFeatured: boolean("is_featured").default(false),
		isPremium: boolean("is_premium").default(false),
		views: integer("views").default(0),
		inquiries: integer("inquiries").default(0),

		// SEO and marketing
		slug: text("slug").unique(),
		metaTitle: text("meta_title"),
		metaDescription: text("meta_description"),
		tags: jsonb("tags"), // Array of tags for search

		// Ownership and relationships
		organizationId: text("organization_id").references(() => organization.id, {
			onDelete: "cascade",
		}),
		userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
		agentId: text("agent_id").references(() => user.id, {
			onDelete: "set null",
		}),

		// Timestamps
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at")
			.notNull()
			.defaultNow()
			.$onUpdateFn(
				/* @__PURE__ */
				() => new Date(),
			),
		publishedAt: timestamp("published_at"),
		expiresAt: timestamp("expires_at"),
	},
	(table) => [
		// Basic indexes
		index("property_property_type_idx").on(table.propertyType),
		index("property_listing_type_idx").on(table.listingType),
		index("property_property_status_idx").on(table.propertyStatus),
		index("property_city_idx").on(table.city),
		index("property_area_idx").on(table.area),
		index("property_price_idx").on(table.price),
		index("property_bedrooms_idx").on(table.bedrooms),
		index("property_size_idx").on(table.size),
		index("property_is_active_idx").on(table.isActive),
		index("property_created_at_idx").on(table.createdAt),
		index("property_organization_id_idx").on(table.organizationId),
		index("property_user_id_idx").on(table.userId),
		index("property_agent_id_idx").on(table.agentId),

		// Composite indexes for common queries
		index("property_type_listing_city_idx").on(
			table.propertyType,
			table.listingType,
			table.city,
		),
		index("property_city_area_price_idx").on(
			table.city,
			table.area,
			table.price,
		),
		index("property_bedrooms_price_idx").on(table.bedrooms, table.price),
		index("property_active_published_idx").on(
			table.isActive,
			table.publishedAt,
		),
		index("property_org_active_idx").on(table.organizationId, table.isActive),

		// Geospatial index for location-based queries
		index("property_location_idx").on(table.latitude, table.longitude),

		// Search optimization indexes
		index("property_slug_idx").on(table.slug),
		index("property_featured_idx").on(table.isFeatured),
		index("property_premium_idx").on(table.isPremium),

		// Portfolio tracking indexes
		index("property_purchase_date_idx").on(table.purchaseDate),
		index("property_portfolio_category_idx").on(table.portfolioCategory),
		index("property_tracking_enabled_idx").on(table.trackingEnabled),
		index("property_last_valuation_date_idx").on(table.lastValuationDate),
		index("property_user_portfolio_idx").on(
			table.userId,
			table.portfolioCategory,
		),
		index("property_org_portfolio_idx").on(
			table.organizationId,
			table.portfolioCategory,
		),
	],
);

// Property amenities junction table
export const propertyAmenity = pgTable(
	"property_amenity",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		propertyId: uuid("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		amenityType: amenityTypeEnum("amenity_type").notNull(),
		description: text("description"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("property_amenity_unique").on(
			table.propertyId,
			table.amenityType,
		),
		index("property_amenity_property_id_idx").on(table.propertyId),
		index("property_amenity_type_idx").on(table.amenityType),
	],
);

// Property views (for tracking different view types)
export const propertyView = pgTable(
	"property_view",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		propertyId: uuid("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		viewType: viewTypeEnum("view_type").notNull(),
		description: text("description"),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("property_view_unique").on(table.propertyId, table.viewType),
		index("property_view_property_id_idx").on(table.propertyId),
		index("property_view_type_idx").on(table.viewType),
	],
);

// Property inquiries/leads
export const propertyInquiry = pgTable(
	"property_inquiry",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		propertyId: uuid("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
		name: text("name").notNull(),
		email: text("email").notNull(),
		phone: text("phone"),
		message: text("message"),
		inquiryType: text("inquiry_type").notNull(), // "viewing", "info", "offer"
		preferredContactMethod: text("preferred_contact_method"), // "email", "phone", "whatsapp"
		status: text("status").notNull().default("new"), // "new", "contacted", "viewing_scheduled", "closed"
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		index("property_inquiry_property_id_idx").on(table.propertyId),
		index("property_inquiry_user_id_idx").on(table.userId),
		index("property_inquiry_status_idx").on(table.status),
		index("property_inquiry_created_at_idx").on(table.createdAt),
		index("property_inquiry_email_idx").on(table.email),
	],
);

// Property favorites/saved listings
export const propertyFavorite = pgTable(
	"property_favorite",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		propertyId: uuid("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("property_favorite_unique").on(table.propertyId, table.userId),
		index("property_favorite_property_id_idx").on(table.propertyId),
		index("property_favorite_user_id_idx").on(table.userId),
		index("property_favorite_created_at_idx").on(table.createdAt),
	],
);

// Property analytics for tracking performance
export const propertyAnalytics = pgTable(
	"property_analytics",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		propertyId: uuid("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		date: timestamp("date").notNull(),
		views: integer("views").default(0),
		inquiries: integer("inquiries").default(0),
		favorites: integer("favorites").default(0),
		shares: integer("shares").default(0),
		phoneClicks: integer("phone_clicks").default(0),
		emailClicks: integer("email_clicks").default(0),
		virtualTourViews: integer("virtual_tour_views").default(0),
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("property_analytics_unique").on(table.propertyId, table.date),
		index("property_analytics_property_id_idx").on(table.propertyId),
		index("property_analytics_date_idx").on(table.date),
		index("property_analytics_views_idx").on(table.views),
	],
);

// Property valuation history for portfolio tracking
export const propertyValuation = pgTable(
	"property_valuation",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		propertyId: uuid("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		valuationAmount: decimal("valuation_amount", {
			precision: 15,
			scale: 2,
		}).notNull(),
		valuationDate: timestamp("valuation_date").notNull(),
		valuationSource: text("valuation_source").notNull(), // "automated", "professional", "user_estimate", "market_analysis"
		valuationMethod: text("valuation_method"), // "comparative_market_analysis", "cost_approach", "income_approach", "automated_valuation_model"
		confidence: real("confidence"), // confidence score 0-100

		// Valuation details
		comparableProperties: jsonb("comparable_properties"), // Array of similar properties used
		marketConditions: jsonb("market_conditions"), // Market factors considered
		adjustments: jsonb("adjustments"), // Price adjustments made
		notes: text("notes"),

		// Professional valuation details
		valuerId: text("valuer_id").references(() => user.id, {
			onDelete: "set null",
		}),
		valuationCompany: text("valuation_company"),
		certificationNumber: text("certification_number"),

		// Change tracking
		previousValuation: decimal("previous_valuation", {
			precision: 15,
			scale: 2,
		}),
		changeAmount: decimal("change_amount", { precision: 15, scale: 2 }),
		changePercentage: real("change_percentage"),

		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(table) => [
		index("property_valuation_property_id_idx").on(table.propertyId),
		index("property_valuation_date_idx").on(table.valuationDate),
		index("property_valuation_source_idx").on(table.valuationSource),
		index("property_valuation_amount_idx").on(table.valuationAmount),
		index("property_valuation_property_date_idx").on(
			table.propertyId,
			table.valuationDate,
		),
		index("property_valuation_valuer_id_idx").on(table.valuerId),
	],
);

// Property portfolio performance tracking
export const propertyPortfolioMetrics = pgTable(
	"property_portfolio_metrics",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		propertyId: uuid("property_id")
			.notNull()
			.references(() => property.id, { onDelete: "cascade" }),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		organizationId: text("organization_id").references(() => organization.id, {
			onDelete: "cascade",
		}),

		// Time period for metrics
		metricDate: timestamp("metric_date").notNull(),

		// Financial metrics
		currentValue: decimal("current_value", {
			precision: 15,
			scale: 2,
		}).notNull(),
		equityValue: decimal("equity_value", { precision: 15, scale: 2 }),
		totalReturn: real("total_return"),
		annualizedReturn: real("annualized_return"),

		// Income metrics
		monthlyRentalIncome: decimal("monthly_rental_income", {
			precision: 10,
			scale: 2,
		}),
		monthlyExpenses: decimal("monthly_expenses", { precision: 10, scale: 2 }),
		netCashFlow: decimal("net_cash_flow", { precision: 10, scale: 2 }),

		// Market performance
		areaAppreciation: real("area_appreciation"), // area average appreciation
		outperformanceRatio: real("outperformance_ratio"), // how property performs vs area average

		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(table) => [
		uniqueIndex("property_portfolio_metrics_unique").on(
			table.propertyId,
			table.metricDate,
		),
		index("property_portfolio_metrics_property_id_idx").on(table.propertyId),
		index("property_portfolio_metrics_user_id_idx").on(table.userId),
		index("property_portfolio_metrics_org_id_idx").on(table.organizationId),
		index("property_portfolio_metrics_date_idx").on(table.metricDate),
		index("property_portfolio_metrics_user_date_idx").on(
			table.userId,
			table.metricDate,
		),
	],
);

export const propertyInsertSchema = createInsertSchema(property, {
	pricePerSqm: z.number().min(0).optional(),
});

// we can use the createUpdateSchema(property).pick({title : true})
export const propertyUpdateSchema = createUpdateSchema(property);
