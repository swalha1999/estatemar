import type { Context as HonoContext } from "hono";
import { auth } from "./auth";

export type CreateContextOptions = {
	context: HonoContext;
};

export async function createContext({ context }: CreateContextOptions) {
	const session = await auth.api.getSession({
		headers: context.req.raw.headers,
	});
	const activeOrganization = await auth.api.getFullOrganization({
		headers: context.req.raw.headers,
	});
	const headers = context.req.raw.headers;
	return {
		headers,
		session,
		activeOrganization,
		honoContext: context,
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
