import type { RouterClient } from "@orpc/server";
import { authRouter } from "./auth";
import { filesRouter } from "./files";
import { healthRouter } from "./health";

export const appRouter = {
	...healthRouter,
	...authRouter,
	...filesRouter,
};

export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
