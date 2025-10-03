import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
	amenityTypeEnum,
	property,
	propertyAmenity,
	propertyAnalytics,
	propertyFavorite,
	propertyInquiry,
	propertyInsertSchema,
	propertyPortfolioMetrics,
	propertyUpdateSchema,
	propertyValuation,
	propertyView,
	viewTypeEnum,
} from "@/db/schema/real_estate";
import { protectedProcedure, publicProcedure } from "../lib/orpc";

const propertyRouter = {
	create: protectedProcedure
		.input(
			propertyInsertSchema.omit({
				userId: true,
				organizationId: true,
				createdAt: true,
				updatedAt: true,
			}),
		)
		.handler(async ({ input, context }) => {
			const [newProperty] = await db
				.insert(property)
				.values({
					...input,
					userId: context.session.user.id,
					organizationId: context.activeOrganization?.id || null,
				} as unknown as typeof property.$inferInsert)
				.returning();

			return {
				success: true,
				data: newProperty,
			};
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				data: propertyUpdateSchema,
			}),
		)
		.handler(async ({ input, context }) => {
			const existingProperty = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.id),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!existingProperty) {
				return {
					success: false,
					error: "Property not found or you don't have permission to update it",
				};
			}

			const [updatedProperty] = await db
				.update(property)
				.set(input.data)
				.where(eq(property.id, input.id))
				.returning();

			return {
				success: true,
				data: updatedProperty,
			};
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const existingProperty = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.id),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!existingProperty) {
				return {
					success: false,
					error: "Property not found or you don't have permission to delete it",
				};
			}

			await db.delete(property).where(eq(property.id, input.id));

			return {
				success: true,
				message: "Property deleted successfully",
			};
		}),

	getById: publicProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input }) => {
			const propertyData = await db.query.property.findFirst({
				where: and(eq(property.id, input.id), eq(property.isActive, true)),
				with: {
					// Add relations if you have them defined in the schema
				},
			});

			if (!propertyData) {
				return {
					success: false,
					error: "Property not found",
				};
			}

			await db
				.update(property)
				.set({ views: sql`${property.views} + 1` })
				.where(eq(property.id, input.id));

			return {
				success: true,
				data: propertyData,
			};
		}),

	list: publicProcedure
		.input(
			z.object({
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(20),
				propertyType: z.string().optional(),
				listingType: z.string().optional(),
				city: z.string().optional(),
				area: z.string().optional(),
				minPrice: z.string().optional(),
				maxPrice: z.string().optional(),
				bedrooms: z.number().optional(),
				bathrooms: z.number().optional(),
				minSize: z.number().optional(),
				maxSize: z.number().optional(),
				search: z.string().optional(),
				sortBy: z
					.enum(["price", "createdAt", "views", "size"])
					.default("createdAt"),
				sortOrder: z.enum(["asc", "desc"]).default("desc"),
			}),
		)
		.handler(async ({ input }) => {
			const conditions = [eq(property.isActive, true)];

			if (input.propertyType) {
				conditions.push(sql`${property.propertyType} = ${input.propertyType}`);
			}

			if (input.listingType) {
				conditions.push(sql`${property.listingType} = ${input.listingType}`);
			}

			if (input.city) {
				conditions.push(ilike(property.city, `%${input.city}%`));
			}

			if (input.area) {
				conditions.push(ilike(property.area, `%${input.area}%`));
			}

			if (input.minPrice) {
				conditions.push(sql`${property.price} >= ${input.minPrice}`);
			}

			if (input.maxPrice) {
				conditions.push(sql`${property.price} <= ${input.maxPrice}`);
			}

			if (input.bedrooms) {
				conditions.push(eq(property.bedrooms, input.bedrooms));
			}

			if (input.bathrooms) {
				conditions.push(eq(property.bathrooms, input.bathrooms));
			}

			if (input.minSize) {
				conditions.push(sql`${property.size} >= ${input.minSize}`);
			}

			if (input.maxSize) {
				conditions.push(sql`${property.size} <= ${input.maxSize}`);
			}

			if (input.search) {
				const searchCondition = or(
					ilike(property.title, `%${input.search}%`),
					ilike(property.description, `%${input.search}%`),
					ilike(property.area, `%${input.search}%`),
					ilike(property.city, `%${input.search}%`),
				);
				if (searchCondition) {
					conditions.push(searchCondition);
				}
			}

			const offset = (input.page - 1) * input.limit;

			const orderByColumn =
				input.sortBy === "price"
					? property.price
					: input.sortBy === "views"
						? property.views
						: input.sortBy === "size"
							? property.size
							: property.createdAt;

			const properties = await db.query.property.findMany({
				where: and(...conditions),
				limit: input.limit,
				offset: offset,
				orderBy:
					input.sortOrder === "desc" ? desc(orderByColumn) : orderByColumn,
			});

			const [{ count }] = await db
				.select({ count: sql<number>`count(*)` })
				.from(property)
				.where(and(...conditions));

			return {
				success: true,
				data: {
					properties,
					pagination: {
						page: input.page,
						limit: input.limit,
						total: Number(count),
						totalPages: Math.ceil(Number(count) / input.limit),
					},
				},
			};
		}),

	getMyProperties: protectedProcedure
		.input(
			z.object({
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(20),
				listingType: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const conditions = [
				or(
					eq(property.userId, context.session.user.id),
					eq(property.organizationId, context.activeOrganization?.id || ""),
				),
			];

			if (input.listingType) {
				conditions.push(sql`${property.listingType} = ${input.listingType}`);
			}

			const offset = (input.page - 1) * input.limit;

			const properties = await db.query.property.findMany({
				where: and(...conditions),
				limit: input.limit,
				offset: offset,
				orderBy: desc(property.createdAt),
			});

			const [{ count }] = await db
				.select({ count: sql<number>`count(*)` })
				.from(property)
				.where(and(...conditions));

			return {
				success: true,
				data: {
					properties,
					pagination: {
						page: input.page,
						limit: input.limit,
						total: Number(count),
						totalPages: Math.ceil(Number(count) / input.limit),
					},
				},
			};
		}),

	addAmenity: protectedProcedure
		.input(
			z.object({
				propertyId: z.string().uuid(),
				amenityType: z.enum(amenityTypeEnum.enumValues),
				description: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "Property not found or you don't have permission",
				};
			}

			const [amenity] = await db
				.insert(propertyAmenity)
				.values({
					propertyId: input.propertyId,
					amenityType: input.amenityType,
					description: input.description,
				})
				.returning();

			return {
				success: true,
				data: amenity,
			};
		}),

	removeAmenity: protectedProcedure
		.input(z.object({ amenityId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const amenity = await db.query.propertyAmenity.findFirst({
				where: eq(propertyAmenity.id, input.amenityId),
			});

			if (!amenity) {
				return {
					success: false,
					error: "Amenity not found",
				};
			}

			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, amenity.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "You don't have permission to modify this amenity",
				};
			}

			await db
				.delete(propertyAmenity)
				.where(eq(propertyAmenity.id, input.amenityId));

			return {
				success: true,
				message: "Amenity removed successfully",
			};
		}),

	addView: protectedProcedure
		.input(
			z.object({
				propertyId: z.string().uuid(),
				viewType: z.enum(viewTypeEnum.enumValues),
				description: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "Property not found or you don't have permission",
				};
			}

			const [view] = await db
				.insert(propertyView)
				.values({
					propertyId: input.propertyId,
					viewType: input.viewType,
					description: input.description,
				})
				.returning();

			return {
				success: true,
				data: view,
			};
		}),

	removeView: protectedProcedure
		.input(z.object({ viewId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const view = await db.query.propertyView.findFirst({
				where: eq(propertyView.id, input.viewId),
			});

			if (!view) {
				return {
					success: false,
					error: "View not found",
				};
			}

			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, view.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "You don't have permission to modify this view",
				};
			}

			await db.delete(propertyView).where(eq(propertyView.id, input.viewId));

			return {
				success: true,
				message: "View removed successfully",
			};
		}),

	createInquiry: publicProcedure
		.input(
			z.object({
				propertyId: z.uuid(),
				name: z.string().min(1),
				email: z.email(),
				phone: z.string().optional(),
				message: z.string().optional(),
				inquiryType: z.enum(["viewing", "info", "offer"]),
				preferredContactMethod: z
					.enum(["email", "phone", "whatsapp"])
					.optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const [inquiry] = await db
				.insert(propertyInquiry)
				.values({
					...input,
					userId: context.session?.user?.id || null,
				})
				.returning();

			await db
				.update(property)
				.set({ inquiries: sql`${property.inquiries} + 1` })
				.where(eq(property.id, input.propertyId));

			return {
				success: true,
				data: inquiry,
			};
		}),

	getPropertyInquiries: protectedProcedure
		.input(
			z.object({
				propertyId: z.string().uuid(),
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(20),
			}),
		)
		.handler(async ({ input, context }) => {
			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "Property not found or you don't have permission",
				};
			}

			const offset = (input.page - 1) * input.limit;

			const inquiries = await db.query.propertyInquiry.findMany({
				where: eq(propertyInquiry.propertyId, input.propertyId),
				limit: input.limit,
				offset: offset,
				orderBy: desc(propertyInquiry.createdAt),
			});

			const [{ count }] = await db
				.select({ count: sql<number>`count(*)` })
				.from(propertyInquiry)
				.where(eq(propertyInquiry.propertyId, input.propertyId));

			return {
				success: true,
				data: {
					inquiries,
					pagination: {
						page: input.page,
						limit: input.limit,
						total: Number(count),
						totalPages: Math.ceil(Number(count) / input.limit),
					},
				},
			};
		}),

	addToFavorites: protectedProcedure
		.input(z.object({ propertyId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const [favorite] = await db
				.insert(propertyFavorite)
				.values({
					propertyId: input.propertyId,
					userId: context.session.user.id,
				})
				.returning();

			return {
				success: true,
				data: favorite,
			};
		}),

	removeFromFavorites: protectedProcedure
		.input(z.object({ propertyId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			await db
				.delete(propertyFavorite)
				.where(
					and(
						eq(propertyFavorite.propertyId, input.propertyId),
						eq(propertyFavorite.userId, context.session.user.id),
					),
				);

			return {
				success: true,
				message: "Property removed from favorites",
			};
		}),

	getMyFavorites: protectedProcedure
		.input(
			z.object({
				page: z.number().min(1).default(1),
				limit: z.number().min(1).max(100).default(20),
			}),
		)
		.handler(async ({ input, context }) => {
			const offset = (input.page - 1) * input.limit;

			const favorites = await db.query.propertyFavorite.findMany({
				where: eq(propertyFavorite.userId, context.session.user.id),
				limit: input.limit,
				offset: offset,
				orderBy: desc(propertyFavorite.createdAt),
				with: {
					property: true,
				},
			});

			const [{ count }] = await db
				.select({ count: sql<number>`count(*)` })
				.from(propertyFavorite)
				.where(eq(propertyFavorite.userId, context.session.user.id));

			return {
				success: true,
				data: {
					favorites,
					pagination: {
						page: input.page,
						limit: input.limit,
						total: Number(count),
						totalPages: Math.ceil(Number(count) / input.limit),
					},
				},
			};
		}),

	addValuation: protectedProcedure
		.input(
			z.object({
				propertyId: z.string().uuid(),
				valuationAmount: z.string(),
				valuationDate: z.date(),
				valuationSource: z.enum([
					"automated",
					"professional",
					"user_estimate",
					"market_analysis",
				]),
				valuationMethod: z.string().optional(),
				confidence: z.number().min(0).max(100).optional(),
				notes: z.string().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "Property not found or you don't have permission",
				};
			}

			const latestValuation = await db.query.propertyValuation.findFirst({
				where: eq(propertyValuation.propertyId, input.propertyId),
				orderBy: desc(propertyValuation.valuationDate),
			});

			const previousValuationAmount = latestValuation?.valuationAmount
				? Number(latestValuation.valuationAmount)
				: null;
			const currentValuationAmount = Number(input.valuationAmount);

			let changeAmount = null;
			let changePercentage = null;

			if (previousValuationAmount) {
				changeAmount = currentValuationAmount - previousValuationAmount;
				changePercentage = (changeAmount / previousValuationAmount) * 100;
			}

			const [valuation] = await db
				.insert(propertyValuation)
				.values({
					...input,
					previousValuation: previousValuationAmount?.toString(),
					changeAmount: changeAmount?.toString(),
					changePercentage,
				})
				.returning();

			await db
				.update(property)
				.set({
					lastValuationDate: input.valuationDate,
					lastValuationAmount: input.valuationAmount,
					valuationSource: input.valuationSource,
				})
				.where(eq(property.id, input.propertyId));

			return {
				success: true,
				data: valuation,
			};
		}),

	getPropertyValuations: protectedProcedure
		.input(z.object({ propertyId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "Property not found or you don't have permission",
				};
			}

			const valuations = await db.query.propertyValuation.findMany({
				where: eq(propertyValuation.propertyId, input.propertyId),
				orderBy: desc(propertyValuation.valuationDate),
			});

			return {
				success: true,
				data: valuations,
			};
		}),

	getPortfolioMetrics: protectedProcedure
		.input(
			z.object({
				startDate: z.date().optional(),
				endDate: z.date().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const conditions = [
				or(
					eq(propertyPortfolioMetrics.userId, context.session.user.id),
					eq(
						propertyPortfolioMetrics.organizationId,
						context.activeOrganization?.id || "",
					),
				),
			];

			if (input.startDate) {
				conditions.push(
					sql`${propertyPortfolioMetrics.metricDate} >= ${input.startDate}`,
				);
			}

			if (input.endDate) {
				conditions.push(
					sql`${propertyPortfolioMetrics.metricDate} <= ${input.endDate}`,
				);
			}

			const metrics = await db.query.propertyPortfolioMetrics.findMany({
				where: and(...conditions),
				orderBy: desc(propertyPortfolioMetrics.metricDate),
			});

			return {
				success: true,
				data: metrics,
			};
		}),

	getPropertyAnalytics: protectedProcedure
		.input(
			z.object({
				propertyId: z.string().uuid(),
				startDate: z.date().optional(),
				endDate: z.date().optional(),
			}),
		)
		.handler(async ({ input, context }) => {
			const propertyData = await db.query.property.findFirst({
				where: and(
					eq(property.id, input.propertyId),
					or(
						eq(property.userId, context.session.user.id),
						eq(property.organizationId, context.activeOrganization?.id || ""),
					),
				),
			});

			if (!propertyData) {
				return {
					success: false,
					error: "Property not found or you don't have permission",
				};
			}

			const conditions = [eq(propertyAnalytics.propertyId, input.propertyId)];

			if (input.startDate) {
				conditions.push(sql`${propertyAnalytics.date} >= ${input.startDate}`);
			}

			if (input.endDate) {
				conditions.push(sql`${propertyAnalytics.date} <= ${input.endDate}`);
			}

			const analytics = await db.query.propertyAnalytics.findMany({
				where: and(...conditions),
				orderBy: desc(propertyAnalytics.date),
			});

			return {
				success: true,
				data: analytics,
			};
		}),
};

export const realEstateRouter = {
	property: propertyRouter,
};
