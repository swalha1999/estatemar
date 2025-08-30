import type { RouterClient } from "@orpc/server";
import { authRouter } from "./auth";
import { filesRouter } from "./files";
import { healthRouter } from "./health";
import { organizationsRouter } from "./organizations";
import { propertiesRouter } from "./properties";

export const appRouter = {
	...healthRouter,
	...authRouter,
	...filesRouter,
	...organizationsRouter,
	...propertiesRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
