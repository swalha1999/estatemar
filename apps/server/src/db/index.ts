import { drizzle } from "drizzle-orm/node-postgres";
import * as authSchema from "./schema/auth";
import * as organizationsSchema from "./schema/organizations";
import * as propertySchema from "./schema/property";

export const db = drizzle(process.env.DATABASE_URL || "", {
	schema: {
		...authSchema,
		...organizationsSchema,
		...propertySchema,
	},
});

export * from "./schema/auth";
export * from "./schema/organizations";
export * from "./schema/property";
