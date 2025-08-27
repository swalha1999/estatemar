import { z } from "zod";
export declare const dataTableItemSchema: z.ZodObject<{
    id: z.ZodNumber;
    header: z.ZodString;
    type: z.ZodString;
    status: z.ZodString;
    target: z.ZodString;
    limit: z.ZodString;
    reviewer: z.ZodString;
}, z.core.$strip>;
export type DataTableItem = z.infer<typeof dataTableItemSchema>;
