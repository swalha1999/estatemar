import type { RouterClient } from "@orpc/server";
import { authRouter } from "./auth";
import { healthRouter } from "./health";
import { realEstateRouter } from "./real-estate";

export const appRouter = {
	health: healthRouter,
	user: authRouter,
	realEstate: realEstateRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
