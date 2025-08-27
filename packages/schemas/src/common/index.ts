import { z } from "zod";

// Data table schema (used in web components)
export const dataTableItemSchema = z.object({
	id: z.number(),
	header: z.string(),
	type: z.string(),
	status: z.string(),
	target: z.string(),
	limit: z.string(),
	reviewer: z.string(),
});

// Export types
export type DataTableItem = z.infer<typeof dataTableItemSchema>;
