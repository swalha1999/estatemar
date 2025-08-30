import type { RouterClient } from "@orpc/server";
import { authRouter } from "./auth";
import { filesRouter } from "./files";
import { healthRouter } from "./health";
import { organizationsRouter } from "./organizations";
import { propertiesRouterNew } from "./properties-new";

export const appRouter = {
	health: healthRouter,
	auth: authRouter,
	files: filesRouter,
	organizations: organizationsRouter,
	properties: propertiesRouterNew,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
