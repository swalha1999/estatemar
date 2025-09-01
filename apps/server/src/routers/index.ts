import type { RouterClient } from "@orpc/server";
import { authRouter } from "./auth";
import { healthRouter } from "./health";
import { organizationRouter } from "./organization";

export const appRouter = {
	health: healthRouter,
	auth: authRouter,
	organization: organizationRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
