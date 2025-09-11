import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AppRouterClient } from "../../../server/src/routers/index";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchInterval: 30 * 1000, // 30 seconds
			refetchOnWindowFocus: true,
		},
	},
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(`Error: ${error.message}`, {
				action: {
					label: "retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},

	}),
});

// Store dynamic headers
let dynamicHeaders: Record<string, string> = {};

export const link = new RPCLink({
	url: `${process.env.NEXT_PUBLIC_SERVER_URL}/rpc`,
	fetch(url, options) {
		return fetch(url, {
			...options,
			credentials: "include",
			headers: {
				...(options as RequestInit)?.headers,
				...dynamicHeaders,
			},
		});
	},
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);

// Helper function to set headers dynamically
export const setOrpcHeaders = (headers: Record<string, string>) => {
	dynamicHeaders = { ...dynamicHeaders, ...headers };
};

// Helper function to clear specific header
export const clearOrpcHeader = (headerName: string) => {
	delete dynamicHeaders[headerName];
};
