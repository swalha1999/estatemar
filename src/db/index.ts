import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from './schema-auth';

// Merge schemas
const mergedSchema = {
	...authSchema,
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
