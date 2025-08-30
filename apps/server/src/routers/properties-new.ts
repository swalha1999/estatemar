import {
	addPropertyAmenitySchema,
	addPropertyImageSchema,
	createPropertySchema,
	getPropertiesSchema,
	getPropertySchema,
	removePropertyImageSchema,
	updatePropertySchema,
} from "@estatemar/schemas/properties";
import { getAuthorizationService, getPropertyService } from "../container";
import { protectedProcedure } from "../lib/orpc";

const propertyService = getPropertyService();
const authService = getAuthorizationService();

export const propertiesRouterNew = {
	createProperty: protectedProcedure
		.input(createPropertySchema)
		.handler(async ({ input, context }) => {
			const authContext = await authService.validateAuthContext(context.session);
			return await propertyService.createProperty(input, authContext);
		}),

	getProperty: protectedProcedure
		.input(getPropertySchema)
		.handler(async ({ input, context }) => {
			const authContext = await authService.validateAuthContext(context.session);
			return await propertyService.getProperty(input.id, authContext);
		}),

	getUserProperties: protectedProcedure
		.input(getPropertiesSchema)
		.handler(async ({ input, context }) => {
			const authContext = await authService.validateAuthContext(context.session);
			
			const pagination = {
				limit: input.limit,
				offset: input.offset,
			};

			const filters = {
				organizationId: input.organizationId,
			};

			return await propertyService.getUserProperties(
				filters,
				pagination,
				authContext,
			);
		}),

	updateProperty: protectedProcedure
		.input(updatePropertySchema)
		.handler(async ({ input, context }) => {
			const authContext = await authService.validateAuthContext(context.session);
			const { id, ...updateData } = input;
			return await propertyService.updateProperty(id, updateData, authContext);
		}),

	addPropertyImage: protectedProcedure
		.input(addPropertyImageSchema)
		.handler(async ({ input, context }) => {
			const authContext = await authService.validateAuthContext(context.session);
			const { propertyId, ...imageData } = input;
			return await propertyService.addPropertyImage(
				propertyId,
				imageData,
				authContext,
			);
		}),

	removePropertyImage: protectedProcedure
		.input(removePropertyImageSchema)
		.handler(async ({ input, context }) => {
			const authContext = await authService.validateAuthContext(context.session);
			return await propertyService.removePropertyImage(
				input.imageId,
				authContext,
			);
		}),

	addPropertyAmenity: protectedProcedure
		.input(addPropertyAmenitySchema)
		.handler(async ({ input, context }) => {
			const authContext = await authService.validateAuthContext(context.session);
			return await propertyService.addPropertyAmenity(
				input.propertyId,
				input.name,
				authContext,
			);
		}),
};