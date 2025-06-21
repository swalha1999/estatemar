import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from './access-layer-v2/schemas/auth.schema';
import * as contactSchema from './access-layer-v2/schemas/contact.schema';
import * as filesSchema from './access-layer-v2/schemas/files.schema';

// Merge schemas
const mergedSchema = {
	...authSchema,
	...contactSchema,
	...filesSchema,
};

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, {
	ssl: false,
	max: 1,
	// connection: {
	// 	application_name: "bosalieh.com",
	// },
});

export const db = drizzle(client, {
	schema: mergedSchema,
});
