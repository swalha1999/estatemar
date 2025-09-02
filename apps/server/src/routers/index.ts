import type { RouterClient } from "@orpc/server";
import { authRouter } from "./auth";
import { healthRouter } from "./health";

export const appRouter = {
	health: healthRouter,
	auth: authRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
