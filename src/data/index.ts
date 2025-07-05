import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as authSchema from './access-layer-v2/schemas/auth.schema';
import * as contactSchema from './access-layer-v2/schemas/contact.schema';
import * as filesSchema from './access-layer-v2/schemas/files.schema';
import * as developerSchema from './access-layer-v2/schemas/developer.schema';
import * as propertySchema from './access-layer-v2/schemas/property.schema';
import * as propertiesFilesSchema from './access-layer-v2/schemas/properties-files.schema';

// Merge schemas
const mergedSchema = {
	...authSchema,
	...contactSchema,
	...filesSchema,
	...developerSchema,
	...propertySchema,
	...propertiesFilesSchema,
};

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString, {
	ssl: false,
	max: 1,
});

export const db = drizzle(client, {
	schema: mergedSchema,
});
