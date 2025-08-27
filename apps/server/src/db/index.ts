import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./schema/auth";
import * as propertySchema from "./schema/property";

export const db = drizzle(process.env.DATABASE_URL || "", {
	schema: {
		...authSchema,
		...propertySchema,
	},
});

export * from "./schema/auth";
export * from "./schema/property";
