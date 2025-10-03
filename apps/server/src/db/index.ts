import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./schema/auth";
import * as realEstateSchema from "./schema/real_estate";

export const db = drizzle(process.env.DATABASE_URL || "", {
	schema: {
		...authSchema,
		...realEstateSchema,
	},
});

export * from "./schema/auth";
export * from "./schema/real_estate";
